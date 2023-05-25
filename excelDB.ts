// excelDB.ts
import * as XLSX from 'xlsx';
import AsyncLock from 'async-lock';
import { v4 as uuidv4 } from 'uuid';
import { filePath } from './settings';

function readExcelFile(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

function writeExcelFile(filePath: string, data: any[]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, filePath);
}

function findRowByID(data: any[], id: string) {
    return data.find(row => row.id === id);
}


function updateRowByID(data: any[], id: string, newData: any) {
    let row = findRowByID(data, id);
    if (row) {
        Object.assign(row, newData);
    } else {
        data.push({ id, ...newData });
    }
    return data;
}



const lock = new AsyncLock();

async function readData(id: string) {
    return await lock.acquire('key', () => {
        const data = readExcelFile(filePath);
        const row = findRowByID(data, id);
        return row ? row : 'No data found for the given ID';
    });
}

async function writeData(id: string, newData: any) {
    await lock.acquire('key', () => {
        let data = readExcelFile(filePath);
        data = updateRowByID(data, id, newData);
        writeExcelFile(filePath, data);
    });
}




function evaluateSheet(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            let data = readExcelFile(filePath);
            const idSet = new Set();

            // Check if there is no label for a column and we have only one column which has more than 1 row
            if (data.length > 1 && Object.keys(data[0]).length === 1 && !data[0].hasOwnProperty('source_language')) {
                // Rename the column to 'source_language'
                data = data.map((row: any) => {
                    const key = Object.keys(row)[0];
                    const value = row[key];
                    delete row[key];
                    row['source_language'] = value;
                    return row;
                });
            }

            // Check if we have 'id' but not 'source_language' as labels
            if (data.length > 0 && data[0].hasOwnProperty('id') && !data[0].hasOwnProperty('source_language')) {
                // Assign the 'source_language' label to the column that is not 'tokens' or 'target_language'
                data = data.map((row: any) => {
                    const keys = Object.keys(row);
                    for (const key of keys) {
                        if (key !== 'id' && key !== 'tokens' && key !== 'target_language') {
                            const value = row[key];
                            delete row[key];
                            row['source_language'] = value;
                            break;
                        }
                    }
                    return row;
                });
            }

            data = data.filter((row: any) => {
                if (!row.id) {
                    row.id = uuidv4();
                    return true;
                }
                if (idSet.has(row.id)) {
                    return false;
                }
                idSet.add(row.id);
                return true;
            });

            // Ensure 'id' is the first key in each object
            data = data.map((row: any) => {
                const { id, ...rest } = row;
                return { id, ...rest };
            });

            writeExcelFile(filePath, data);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}





export { evaluateSheet, readData, writeData, readExcelFile, writeExcelFile, findRowByID, updateRowByID };


