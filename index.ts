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

            const jsonData = XLSX.utils.sheet_to_json(worksheet);
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

// // Usage
// (async () => {
//     const xlsxManager = new XLSXManager('./test.xlsx');

//     // Write data
//     const data = [
//         { source_language: 'All children, except one, grow up.', target_language: '所有的孩子，除了一个，都长大了', total_tokens: null },
//         { source_language: 'They soon know that they will grow up, and the way Wendy knew was this.', target_language: '他们很快就知道他们会长大，而温迪知道的方式是这样的。', total_tokens: null },
//         { source_language: 'You always know after you are two. Two is the beginning of the end.', target_language: '你在两岁后就会知道。两岁是结束的开始。', total_tokens: null }]
//     await xlsxManager.writeData(data);

//     // Append a row
//     const newRow = { source_language: 'This was all that passed between them on the subject, but henceforth Wendy knew that she must grow up.', target_language: '这是他们之间关于这个话题的全部内容，但从此以后，温迪知道她必须长大。', total_tokens: null };
//     await xlsxManager.appendRow(newRow);

//     // Update the third column
//     await xlsxManager.updateThirdColumn((row) => {
//         // Update logic here. For example, return the total_tokens based on number of source_language tokens and target_language tokens
//         return encode(row.source_language).length + encode(row.target_language).length
//     });

//     // Read data
//     const readData = await xlsxManager.readData();
//     console.log(readData);

// })();

/**
 
1. We first calculate the total tokens for the first 10 rows.
2. We then adjust the number of rows based on the total tokens. If the total tokens exceed the maximum, we select a smaller number of rows. If the total tokens are less than the maximum, we select additional rows to get closer to the maximum.
3. We send the API requests for the selected rows using `Promise.all` and the `retryWithExponentialBackoff` function.
4. We wait for all the API requests to complete and then update the second and third columns with the translations and the total tokens, respectively.

 */


const sendTranslationRequest = async (text: string) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "assistant", content: "Translate the following English text to French" },
            { role: "user", content: text }],
    });
    return completion.data.choices[0].message?.content;
};

const calculateTokens = (text: string) => {
    return encode(text).length;
};

const handleTasks = async () => {
    const xlsxManager = new XLSXManager('./test.xlsx');
    let data = await xlsxManager.readData();
    let totalTokens = 0;

    const keys = Object.keys(data[0]);
    const secondColumnExists = keys.length >= 2;

    if (!secondColumnExists) {
        data = data.map((row: any) => ({ ...row, target_language: null }));
    }

    for (let i = 0; i < data.length; i++) {
        const sourceTokens = calculateTokens(data[i].source_language);

        if (totalTokens + sourceTokens > 20000) {
            break;
        }

        totalTokens += sourceTokens;

        const translation = await retryWithExponentialBackoff(sendTranslationRequest, 1, 2, true, 10, ['RateLimitError'])(data[i].source_language);
        data[i].target_language = translation;

        const targetTokens = calculateTokens(translation);
        totalTokens += targetTokens;

        data[i].total_tokens = sourceTokens + targetTokens;
    }

    await xlsxManager.writeData(data);
};

handleTasks().catch(console.error);