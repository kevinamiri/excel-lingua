import {
    encode
} from 'gpt-tokenizer'

import { xlsFilePath } from './settings'
import { xlsxHandler } from './utils'


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

export const batchEstimate = async () => {
    const readExcelFile = new xlsxHandler(xlsFilePath);
    let data = await readExcelFile.validateData();
    // const firstColumn = data.map((row: any) => (Object.values(row)[0])); // first column
    const source_language = data.map((row: any) => row.source_language);
    // size of tokens in source language
    const tokens = tokenSize(source_language)
    console.log('\x1b[38;5;209m\x1b[40m%s\x1b[0m', 'Total tokens of source_language:', '\x1b[35m\x1b[1m', tokens);
    // token bold and yellow
    const batch_size = Math.round(tokens / (200 * 2))
    const allowedPerToken = tokens / 40000
    console.log('\x1b[90m\x1b[40m%s\x1b[0m', `Total Batches: ${batch_size + 1}`)
    return batch_size
};