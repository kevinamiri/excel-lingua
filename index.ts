import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { retryWithExponentialBackoff } from './backoff'
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { batchSize, modelSettings, xlsFilePath } from './settings';


import { outputpath } from './settings';
import { xlsxHandler } from './utils';
// Load environment variables from .env file
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
interface ExcelRow {
    source_language: string;
    target_language: string;
    total_tokens: number;
}



XLSX.set_fs(fs);

// Stream read function
function read(filename: string) {
    const stream = fs.createReadStream(filename);
    const buffers: any[] = [];
    return new Promise<XLSX.WorkBook>((resolve, reject) => {
        stream.on('data', (data) => buffers.push(data));
        stream.on('end', () => {
            const buffer = Buffer.concat(buffers);
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            resolve(workbook);
        });
        stream.on('error', reject);
    });
}

// Stream write function
function write(workbook: XLSX.WorkBook, filename: string) {
    const stream = fs.createWriteStream(filename);
    const buffer = XLSX.write(workbook, { type: 'buffer' });
    stream.write(buffer);
    stream.end();
}

const appendExcel = async (row: any[]) => {
    return read(outputpath)
        .then((workbook) => {
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: -1 });
            write(workbook, outputpath);
        })
        .catch(console.error);

}

const sendTranslationRequest = async (text: string) => {
    try {

        // if text length is less than 2 characters, return the text
        if (text.length < 2) {
            return { content: text, total_tokens: 0 }
        }

        const chat = await openai.createChatCompletion(modelSettings(text)).catch((error) => {
            console.error(`${error.response.status} : ${error.response.statusText} Message: ${JSON.stringify(error.response.data.error.message)}`);
            // if error.response.status is 429 or 500, retry
            if (error.response.status === 429 || error.response.status === 500) {
                // retry ...
                console.log('\x1b[90m\x1b[40m%s\x1b[0m', `${error.response.status} :retrying soon...`)
            }
            throw error.response.status
        });

        return { content: chat.data.choices[0].message?.content, total_tokens: chat.data.usage.total_tokens }

    } catch (error) {
        console.log('\x1b[38;5;209m\x1b[40m%s\x1b[0m', error.response.statusText);


    }
};


// Define AsyncFunction type for asyncFn parameter
type AsyncFunction<T> = (item: T) => Promise<void>;

export async function processBatches<T>(list: T[], batchSizeMax: number = 200, asyncFn: AsyncFunction<T>): Promise<void> {
    try {
        // Divide the list into smaller parts
        const batches: T[][] = [];

        for (let i = 0; i < list.length; i += batchSizeMax) {
            const batch = list.slice(i, i + batchSizeMax);
            console.log('\x1b[90m\x1b[40m%s\x1b[0m', `Processing ${i + 1}th ...`)
            batches.push(batch);
        }

        // Process each batch sequentially with setTimeout() to avoid rate limiting
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const batchNumber = i + 1;
            console.log('\x1b[35m\x1b[3m%s\x1b[0m', `Step ${batchNumber} :  ${batch.length * batchNumber} / ${list.length}  processed.`)
            // Run asyncFn for each item in the batch
            const promises = batch.map(item => asyncFn(item));
            // Wait for all promises in the batch to resolve
            await Promise.all(promises);
            // Wait for a minute before processing the next batch
            console.log('\x1b[90m\x1b[40m%s\x1b[0m', 'Waiting for 1 minute before processing the next batch...');
            await new Promise(resolve => setTimeout(resolve, 60000));
            // when all batches are processed, log the final message
            if (i === batches.length - 1) {
                console.log('\x1b[40m\x1b[36m%s\x1b[0m', '✓ All batches performed successfully.');
            }
        }

        return Promise.resolve();
    } catch (error) {
        console.error("Error processing batches: ", error);
        throw error;
    }
}

/* 
1. First, split the list into smaller sections, each with the desired batch size.
2. Next, process each batch one at a time using Promise.all().
3. In the loop, run the asyncFn for every item in the batch. This is when the asynchronous function takes place.
4. Lastly, wait for all promises in the batch to be completed. You can do this with Promise.all(promises). */

const handleTasks = async () => {
    try {
        const xlsxManager = new xlsxHandler(xlsFilePath);
        let data = await xlsxManager.validateData();

        // Get the keys (property names) of the first object in the 'data' array.
        const keys = data.length > 1 ? Object.keys(data[0]) : [];

        // Check if there are at least two columns (keys) present in the first object.
        const secondColumnExists = keys.length >= 2;

        if (!secondColumnExists) {
            data = data.map((row: any) => ({ ...row, target_language: null }));
        }
        // Get the batch size from the batchSize() function : number of rows to process in one minute
        const batch = await batchSize();
        // Split the data into batches of 60 using the processInBatches() function
        await processBatches(data, batch, async (row: any) => {

            retryWithExponentialBackoff(sendTranslationRequest)(row.source_language)
                .then((translation: any) => {
                    row.target_language = translation.content;
                    row.total_tokens = translation.total_tokens;
                    return appendExcel([row.source_language, row.target_language, row.total_tokens]);
                })
            await new Promise(resolve => setTimeout(resolve, 1000));

        });
    } catch (error) {
        console.error("Error handling tasks: ", error);
    }
};

handleTasks().catch(error => console.error(error));