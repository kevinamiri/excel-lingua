import { readData, writeData } from './excelDB';

async function main() {
    const data = await readData(1);
    console.log(data);

    await writeData(2, { name: 'John', age: 30 });
}

main();
