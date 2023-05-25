import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import appendDataToSheet from './appendDataToSheet';

// File path
const filePath = 'existingWorkbook.xlsx';

// Generate a UUID v4
const uuid = uuidv4();

// Validate the UUID
if (!uuidValidate(uuid)) {
    throw new Error('Invalid UUID');
}

// Data to append (with the UUID as the first column)
const dataToAppend = [
    [uuid, 'New', 'Row', 'Data', '1'],
    [uuid, 'New', 'Row', 'Data', '2'],
    [uuid, 'New', 'Row', 'Data', '3'],
];

// Load an existing workbook from a file or create a new one
let workbook: XLSX.WorkBook;
if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
} else {
    workbook = XLSX.utils.book_new();
}

// Append data to a sheet
const updatedWorkbook = appendDataToSheet(workbook, {
    sheetName: 'Sheet1',
    data: dataToAppend,
});

// Save the updated workbook to a file
XLSX.writeFile(updatedWorkbook, filePath);
