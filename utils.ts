import * as XLSX from 'xlsx';
import * as fs from 'fs';


export class xlsxHandler {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async validateData(): Promise<any> {
        // Read the data from the Excel sheet.
        try {
            const buffer = fs.readFileSync(this.filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let jsonData = XLSX.utils.sheet_to_json(worksheet);
            let rows = jsonData.length;
            console.log('\x1b[90m\x1b[40m%s\x1b[0m', `validating excel file ... ${rows} rows found`);
            // Check if the data is empty
            if (rows === 0) {
                console.error('Error: The input file is empty.');

            }

            // Check if the column labels are correct
            const keys = jsonData.length > 1 ? Object?.keys(jsonData?.[0]) : null;
            if (keys && keys[0] && keys[0] !== 'source_language' && keys[1] !== 'target_language' && keys[2] !== 'total_tokens') {
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
            console.log('\x1b[40m\x1b[36m%s\x1b[0m', '✓ Validation Done.');
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
            console.log('\x1b[40m\x1b[36m%s\x1b[0m', '✓ Write Done.');
        }
    }
}