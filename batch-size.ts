import {
    encode
} from 'gpt-tokenizer'

export const tokenSize = (lists: string[]) => {
    const numberOfTokens = lists.map(str => {
        const numberOfTokens = str.length > 0 ? encode(str).length : 0
        return numberOfTokens
    })
    const sum = numberOfTokens.reduce((a, b) => {
        return a + b
    })
    return sum
}

import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { xlsFilePath } from './settings'

class ExcelReader {
    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async writeData(data: any) {
        // Implement your method to write data back to the Excel file.
    }

    async readExcelFile(): Promise<any> {
        try {
            const buffer = fs.readFileSync(this.filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Check if the column labels are correct
            const keys = Object.keys(jsonData[0]);
            if (keys[0] !== 'source_language' && keys[1] !== 'target_language' || keys[2] !== 'total_tokens') {
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
        }
    }
}


export const batchEstimate = async () => {
    try {
        const readExcelFile = new ExcelReader(xlsFilePath);
        let data = await readExcelFile.readExcelFile();
        // const firstColumn = data.map((row: any) => (Object.values(row)[0])); // first column
        const source_language = data.map((row: any) => row.source_language);
        // size of tokens in source language
        const tokens = tokenSize(source_language)
        console.log('\x1b[35m\x1b[3m%s\x1b[0m', 'Total tokens of source_language:', '\x1b[35m\x1b[1m', tokens);
        // token bold and yellow
        const batch_size = Math.round(tokens / (200 * 2))
        console.log('\x1b[32m\x1b[4m%s\x1b[0m', `Total Batches: ${batch_size + 1}`)
        return batch_size
    } catch (error) {
        console.error("Error handling tasks: ", error);
        throw error;
    }
};