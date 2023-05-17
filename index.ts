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

    public async appendRow(rowData: any): Promise<void> {
        try {
            const jsonData = await this.readData();
            jsonData.push(rowData);

            await this.writeData(jsonData);
        } catch (error) {
            console.error('Error appending row to the XLSX file:', error);
            throw error;
        } finally {
            console.log('Append operation completed.');
        }
    }

    public async appendColumn(columnData: any): Promise<void> {
        try {
            const jsonData = await this.readData();
            jsonData.forEach((row: { [x: string]: any; }, index: string | number) => {
                row['newColumn'] = columnData[index] || null;
            });

            await this.writeData(jsonData);
        } catch (error) {
            console.error('Error appending column to the XLSX file:', error);
            throw error;
        } finally {
            console.log('Append column operation completed.');
        }
    }
    public async updateSecondColumn(updateFunction: (firstColumnValue: any) => any): Promise<void> {
        try {
            const jsonData = await this.readData();
            const keys = Object.keys(jsonData[0]);

            if (keys.length < 2) {
                throw new Error('The data does not have at least two columns.');
            }

            jsonData.forEach((row: { [x: string]: any; }) => {
                row[keys[1]] = updateFunction(row[keys[0]]);
            });

            await this.writeData(jsonData);
        } catch (error) {
            console.error('Error updating the second column in the XLSX file:', error);
            throw error;
        } finally {
            console.log('Update operation completed.');
        }
    }

    public async updateThirdColumn(updateFunction: (row: any) => any): Promise<void> {
        try {
            const jsonData = await this.readData();
            const keys = Object.keys(jsonData[0]);

            if (keys.length < 3) {
                console.log('The data does not have at least three columns. Appending a new column...');
                keys.push('total_tokens');
            }

            jsonData.forEach((row) => {
                row[keys[2]] = updateFunction(row);
            });

            await this.writeData(jsonData);
        } catch (error) {
            console.error('Error updating the third column in the XLSX file:', error);
            throw error;
        } finally {
            console.log('Update operation completed.');
        }
    }

}


const sendTranslationRequest = async (text: string) => {
    // const completion = await openai.createCompletion({
    //     model: "gpt-3.5-turbo",
    //     max_tokens: 700,
    //     temperature: 0,
    //     prompt: text,

    // });

    const response = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: text,
        temperature: 0.5,
        instruction: "Translate it into Swedish",
    });
    console.log("Starting to process " + text.substring(0.10))
    // const chat = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         { role: "assistant", content: "Translate the following English text to French" },
    //         { role: "user", content: text }],
    // });
    console.log({ total_token: response.data.usage.total_tokens })
    return response.data.choices[0].text
    // return chat.data.choices[0].message?.content;
};

const calculateTokens = (text: string) => {
    return encode(text).length;
};

const handleTasks = async () => {
    const xlsxManager = new XLSXManager('./testing.xlsx');
    let data = await xlsxManager.readData();
    // await xlsxManager.ensureColumns();

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


    while (data.length) {
        batches.push(data.splice(0, batchSize));
    }

    // Process each batch
    for (const batch of batches) {
        let totalTokens = 0;

        // Process each row in the batch
        for (let i = 0; i < batch.length; i++) {
            const sourceTokens = calculateTokens(batch[i].source_language);

            if (totalTokens + sourceTokens > 20000) {
                // If the token limit is reached, wait for a minute and reset the total token count
                await new Promise(resolve => setTimeout(resolve, 60000));
                totalTokens = 0;
            }

            totalTokens += sourceTokens;

            const translation = await retryWithExponentialBackoff(sendTranslationRequest, 1, 2, true, 10, ['RateLimitError'])(batch[i].source_language);
            batch[i].target_language = translation;

            const targetTokens = calculateTokens(translation);
            totalTokens += targetTokens;

            batch[i].total_tokens = sourceTokens + targetTokens;
        }

        // Write the updated batch back to the Excel file
        await xlsxManager.appendRow(batch);

        // Wait for a minute before processing the next batch
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
};

handleTasks().catch(console.error);