// index.ts
import { readExcelFile, readData, evaluateSheet, writeData } from './excelDB';

async function main() {
    try {
        // 1. Evaluate the Excel sheet
        await evaluateSheet('inputs.xlsx');

        // 2. Read all data from the Excel file
        const allData = readExcelFile('inputs.xlsx');

        // Extract all IDs from the data
        const allIds = allData.map((row: any) => row.id);

        // 3. For each ID, read the corresponding data and print it
        for (const id of allIds) {
            const rowData = await readData(id);
            const { name, age } = rowData;

            // 4. Update the age for each row and write it back to the Excel file
            await writeData(id, { age: age + 1 });
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
