

// index.ts
import { readExcelFile, readData, evaluateSheet, writeData } from './excelDB';

async function main() {


    evaluateSheet('inputs.xlsx');
    const data = await readData(1);
    console.log(data);

    // evaluateSheet('your-file-path.xlsx');
    // writeData(2, {name: 'John', age: 30});

}

main();
