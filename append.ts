import * as XLSX from 'xlsx';

interface AppendDataOptions {
    sheetName: string;
    data: any[][];
}

// const newData: unknown[][] = [
//     // Add data rows here
//   ];

function appendDataToSheet(workbook: XLSX.WorkBook, options: AppendDataOptions): XLSX.WorkBook {
    const { sheetName, data } = options;

    // Get the existing worksheet
    let worksheet = workbook.Sheets[sheetName];

    // If the worksheet does not exist, create a new one
    if (!worksheet) {
        worksheet = workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet([]);
    }

    // Convert the worksheet to array of arrays
    const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Append the new data
    const newData: any = [...existingData, ...data];


    // Convert the data back to a worksheet and replace the existing worksheet
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(newData);

    return workbook;
}

export default appendDataToSheet;
