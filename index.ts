import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { retryWithExponentialBackoff } from './backoff'
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { batchSize, modelSettings, xlsFilePath } from './settings';

// Load environment variables from .env file
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


export class XLSXManager {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async readData(): Promise<any> {
        // Read the data from the Excel sheet.
        try {
            const buffer = fs.readFileSync(this.filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Check if the column labels are correct
            const keys = Object.keys(jsonData?.[0]);
            if (keys[0] && keys[0] !== 'source_language' && keys[1] !== 'target_language' && keys[2] !== 'total_tokens') {
                // If not, set the column labels and write the data back to the Excel sheet
                jsonData = jsonData.map((row, index) => {
                    return {
                        source_language: row[keys[0]],
                        target_language: row[keys[1]],
                        total_tokens: row[keys[2]]
                    };
                });

                await this.writeData(jsonData);
            }
            console.log('\x1b[32m\x1b[4m%s\x1b[0m', 'Reading excel file ...');
            return jsonData;
        } catch (error) {
            console.error('Error reading the XLSX file:', error);
            throw error;
        } finally {
            console.log('\x1b[40m\x1b[36m%s\x1b[0m', '✓ Reading Done.');
        }
    }

    public async writeData(data: any[]): Promise<void> {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet);
            XLSX.writeFile(workbook, this.filePath);
        } catch (error) {
            console.error('Error writing to the XLSX file:', error);
            throw error;
        } finally {
            console.log('Write operation completed.');
        }
    }

    public async appendDataToXLSX(newData: any) {
        // the appendDataToXLSX() method to append the new data to the Excel sheet.
        try {
            // Read the existing workbook
            const buffer = fs.readFileSync(this.filePath);
            let workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[1];
            // const sheetName = (parseInt(sheetName1) + 1).toString();
            let worksheet = workbook.Sheets[sheetName];
            // Convert worksheet to JSON
            let data = XLSX.utils.sheet_to_json(worksheet);

            // Append new data
            data.push(newData);

            // Convert JSON to worksheet
            let newWorksheet = XLSX.utils.json_to_sheet(data);

            // Remove old worksheet
            delete workbook.Sheets[sheetName];
            const sheetIndex = workbook.SheetNames.indexOf(sheetName);
            if (sheetIndex > -1) {
                workbook.SheetNames.splice(sheetIndex, 1);
            }

            // Replace old worksheet with new worksheet
            XLSX.utils.book_append_sheet(workbook, newWorksheet, sheetName);

            // Write workbook to file
            XLSX.writeFile(workbook, this.filePath);
            console.log('\x1b[32m%s\x1b[0m', 'Data added to next sheet successfully');
        } catch (error) {
            console.error("Error appending data: ", error);
        }
    }

}

const sendTranslationRequest = async (text: string) => {
    try {

        // if text length is less than 2 characters, return the text
        if (text.length < 2) {
            return { content: text, total_tokens: 0 }
        }

        const chat = await openai.createChatCompletion(modelSettings(text)).catch((error) => {
            console.error("Error sending translation request: ", `message: ${error.response.statusText} and status code: ${error.response.status} and data: ${JSON.stringify(error.response.data)}`);
            throw error;
        });

        return { content: chat.data.choices[0].message?.content, total_tokens: chat.data.usage.total_tokens }

    } catch (error) {
        console.error("Error sending translation request: ", `message: ${error.response.statusText} and status code: ${error.response.status} and data: ${JSON.stringify(error.response.data)}`);
        throw error;
    } finally {
        console.log('\x1b[40m\x1b[36m%s\x1b[0m', '✓ Done ');
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
            console.log('\x1b[32m\x1b[4m%s\x1b[0m', `Processing ${i + 1}th ...`)
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
            console.log('\x1b[32m\x1b[4m%s\x1b[0m', 'Waiting for 1 minute before processing the next batch...');
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
        const xlsxManager = new XLSXManager(xlsFilePath);
        let data = await xlsxManager.readData();

        const keys = Object.keys(data[0]);
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
                    // Update the row in the Excel file
                    return xlsxManager.appendDataToXLSX(row);
                })
            await new Promise(resolve => setTimeout(resolve, 1000));

        });
    } catch (error) {
        console.error("Error handling tasks: ", error);
        throw error;
    }
};

handleTasks().catch(error => console.error(error));