
// index.ts
import { readExcelFile, readData, evaluateSheet, writeData } from './excelDB';


import { retryWithExponentialBackoff } from './backoff'
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { batchSize, modelSettings, xlsFilePath } from './settings';


import { outputpath } from './settings';
// Load environment variables from .env file
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
interface ExcelRow {
    id: string;
    source_language: string;
    target_language: string;
    tokens: number;
}

/**
 * 
 * @param text  string to be translated
 * @returns { Promise<{content: string, total_tokens: number}>
 */
const sendTranslationRequest = async (text: string, id: string) => {

    // if text length is less than 2 characters, return the text
    if (text.length < 2) {
        return { content: text, total_tokens: 0 }
    }

    const chat = await openai.createChatCompletion(modelSettings(`${text}`)).catch((error) => {
        console.error(`${error.response.status} : ${error.response.statusText} Message: ${JSON.stringify(error.response.data.error.message)}`);
        // if error.response.status is 429 or 500, retry
        if (error.response.status === 429 || error.response.status === 500) {
            // retry ...
            console.log('\x1b[90m\x1b[40m%s\x1b[0m', `${error.response.status} :retrying soon...`)
        }
        throw error
    });

    return { id, content: chat.data.choices[0].message?.content, total_tokens: chat.data.usage.total_tokens }

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


async function main() {
    try {
        // 1. Evaluate the Excel sheet
        await evaluateSheet('inputs.xlsx');

        // 2. Read all data from the Excel file
        const allData = readExcelFile('inputs.xlsx');

        // Extract all IDs from the data
        // const allIds = allData.map((row: any) => row.id);

        console.log(allData);

        await processBatches(allData, 200, async (row: any) => {

            retryWithExponentialBackoff(sendTranslationRequest)(row.source_language, row.id)
                .then((translation: any) => {
                    row.target_language = translation.content;
                    row.total_tokens = translation.total_tokens;
                    row.id = translation.id;
                    return writeData(translation.id, { tokens: translation.total_tokens, source_language: row.source_language, target_language: translation.content });
                    // return row;

                    //return appendExcel([row.source_language, row.target_language, row.total_tokens]); // append the translated text to the excel file

                })
            await new Promise(resolve => setTimeout(resolve, 1000));

        });

        // 3. For each ID, read the corresponding data and print it
        // for (const id of allIds) {
        //     const rowData = await readData(id);
        //     const { source_language, target_language, tokens } = rowData;
        //     console.log(`ID: ${id}, Source: ${source_language}, Target: ${target_language}, Tokens: ${tokens}`);

        //     // 4. Update the age for each row and write it back to the Excel file
        //     await writeData(id, { tokens: tokens + 1, source_language: source_language + 33, target_language: target_language - 4 });
        // }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();


