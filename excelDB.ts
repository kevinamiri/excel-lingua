// excelDB.ts
import * as XLSX from 'xlsx';
import AsyncLock from 'async-lock';


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

function findRowByID(data: any[], id: number) {
    return data.find(row => row.id === id);
}


function updateRowByID(data: any[], id: number, newData: any) {
    let row = findRowByID(data, id);
    if (row) {
        Object.assign(row, newData);
    } else {
        data.push({ id, ...newData });
    }
    return data;
}



const lock = new AsyncLock();

async function readData(id: number) {
    return await lock.acquire('key', () => {
        const data = readExcelFile('inputs.xlsx');
        const row = findRowByID(data, id);
        return row ? row : 'No data found for the given ID';
    });
}

async function writeData(id: number, newData: any) {
    await lock.acquire('key', () => {
        let data = readExcelFile('inputs.xlsx');
        data = updateRowByID(data, id, newData);
        writeExcelFile('outputs.xlsx', data);
    });
}


export { readData, writeData, readExcelFile, writeExcelFile, findRowByID, updateRowByID };


