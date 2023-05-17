find bugs in the following I get the following error:

Error appending data:  Error: Worksheet with name |Sheet1| already exists!


```typescript
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {
    encode
} from 'gpt-tokenizer'
import { retryWithExponentialBackoff } from './backoff'


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
            const sheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[sheetName];
            // Convert worksheet to JSON
            let data = XLSX.utils.sheet_to_json(worksheet);

            // Append new data
            data.push(newData);

            // Convert JSON to worksheet
            let newWorksheet = XLSX.utils.json_to_sheet(data);

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
    console.log("Starting to process " + text.substring(0.10))
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

const handleTasks = async () => {
    const xlsxManager = new XLSXManager('./testing.xlsx');
    let data = await xlsxManager.readData();

    const keys = Object.keys(data[0]);
    const secondColumnExists = keys.length >= 2;

    if (!secondColumnExists) {
        data = data.map((row: any) => ({ ...row, target_language: null }));
    }

    // Split the data into batches of 10-20 rows
    type T = any; // Replace 'any' with the actual type of the elements in your 'data' array
    const batchSize: number = 20; // Define your batchSize as needed
    const batches: T[][] = [];

    while (data.length) {
        batches.push(data.splice(0, batchSize));
    }

    // Process each batch
    for (const batch of batches) {
        // Prepare all the promises for the batch
        const promises = batch.map((row: any) => {
            return retryWithExponentialBackoff(sendTranslationRequest, 1, 2, true, 10, ['RateLimitError'])(row.source_language)
                .then((translation: any) => {
                    row.target_language = translation.content;
                    row.total_tokens = translation.total_tokens;
                    // Update the row in the Excel file
                    return xlsxManager.appendDataToXLSX(row);
                });
        });

        // Wait for all the promises to resolve
        await Promise.all(promises);

        // Update the second and third columns in the Excel file
        // await xlsxManager.updateSecondColumn((firstColumnValue: any) => firstColumnValue.target_language);
        // await xlsxManager.updateThirdColumn((row: any) => row.total_tokens);

        // Wait for a minute before processing the next batch
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
};

handleTasks()


```