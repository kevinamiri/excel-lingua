import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {
    encode
} from 'gpt-tokenizer'
import { retryWithExponentialBackoff } from './backoff'

/* Here is the explanation for the code above:
1. First, we create an instance of the XLSXManager class, which we use to read and write data to the Excel sheet.
2. Next, we call the readData() method to read the data from the Excel sheet. The method returns a promise, so we use await to wait for it to complete. We also wrap the code in a try-catch block to handle any errors.
3. Inside the try block, we check if the data has the correct column labels. If not, we update the column labels and write the data back to the Excel sheet.
4. Finally, we call the appendDataToXLSX() method to append the new data to the Excel sheet. */

import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


class XLSXManager {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async readData(): Promise<any> {
        try {
            const buffer = fs.readFileSync(this.filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Check if the column labels are correct
            const keys = Object.keys(jsonData[0]);
            if (keys[0] !== 'source_language' || keys[1] !== 'target_language' || keys[2] !== 'total_tokens') {
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

            return jsonData;
        } catch (error) {
            console.error('Error reading the XLSX file:', error);
            throw error;
        } finally {
            console.log('Read operation completed.');
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
        try {
            // Read the existing workbook
            const buffer = fs.readFileSync(this.filePath);
            let workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[2];
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

            console.log("Data appended successfully");
        } catch (error) {
            console.error("Error appending data: ", error);
        }
    }

}


const sendTranslationRequest = async (text: string) => {

    const response = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: text,
        instruction: "Translate it into Swedish",
    });
    console.log("Processing " + text.substring(0, 10))
    // const chat = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         { role: "assistant", content: "Translate the following English text to French" },
    //         { role: "user", content: text }],
    // });
    // console.log({ total_token: response.data.usage.total_tokens })
    // console.log(response.data)
    return { content: response.data.choices[0].text, total_tokens: response.data.usage.total_tokens }
    // return chat.data.choices[0].message?.content;
};

const calculateTokens = (text: string) => {
    return encode(text).length;
};


// Define AsyncFunction type for asyncFn parameter
type AsyncFunction<T> = (item: T) => Promise<void>;

export async function processBatches<T>(list: T[], batchSizeMax: number, asyncFn: AsyncFunction<T>): Promise<void> {
    // Divide the list into smaller parts
    const batches: T[][] = [];

    // If vectorizer API has a rate limit of batchSizeMax objects per minute
    for (let i = 0; i < list.length; i += batchSizeMax) {
        const batch = list.slice(i, i + batchSizeMax);
        batches.push(batch);
    }

    // Process each batch sequentially with setTimeout() to avoid rate limiting
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const batchNumber = i + 1;
        console.log(`Processing batch of length ${batch.length}:`, batch[0], '-', batch[batch.length - 1]);
        console.log(`Step ${batchNumber} :  ${batch.length} / ${list.length}  processed.`)
        // Run asyncFn for each item in the batch
        const promises = batch.map(item => asyncFn(item));
        // Wait for all promises in the batch to resolve
        await Promise.all(promises);
        // Wait for a minute before processing the next batch
        await new Promise(resolve => setTimeout(resolve, 60000));
        console.log('Waiting for 1 minute before processing the next batch...');
        // when all batches are processed, log the final message
        if (i === batches.length - 1) {
            console.log('All batches performed successfully.');
        }
    }

    return Promise.resolve();
}



/* 
1. First, split the list into smaller sections, each with the desired batch size.
2. Next, process each batch one at a time using Promise.all().
3. In the loop, run the asyncFn for every item in the batch. This is when the asynchronous function takes place.
4. Lastly, wait for all promises in the batch to be completed. You can do this with Promise.all(promises). */

const handleTasks = async () => {
    const xlsxManager = new XLSXManager('./testing.xlsx');
    let data = await xlsxManager.readData();

    const keys = Object.keys(data[0]);
    const secondColumnExists = keys.length >= 2;

    if (!secondColumnExists) {
        data = data.map((row: any) => ({ ...row, target_language: null }));
    }

    // Split the data into batches of 60 using the processInBatches() function
    await processBatches(data, 100, async (row: any) => {

        await retryWithExponentialBackoff(sendTranslationRequest)(row.source_language)
            .then((translation: any) => {
                row.target_language = translation.content;
                row.total_tokens = translation.total_tokens;
                // Update the row in the Excel file
                return xlsxManager.appendDataToXLSX(row);
            })
        await new Promise(resolve => setTimeout(resolve, 1000));

    });

};

handleTasks().catch(error => console.error(error));

