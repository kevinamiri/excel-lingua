import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "openai/dist/api";
import { batchEstimate } from "./batch-size";

// Path of the Excel sheet
export const xlsFilePath = './inputs.xlsx';

/**
 * it will instruct model to perform a specific task. for example, 
 * for translating a text we will use 'translate the following into ...'
 */
export const systemPrompt = `Translate the following inputs into French:`;

/**
 * The prompt examples are the inputs and outputs that will be used so the model can learn to translation stye.
 */
export const promptExamples = [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Bonjour" },
    { role: "user", content: "Goodbye" },
    { role: "assistant", content: "Au revoir" },

];
const useExamples = false;


// Set default batch size: less than 200 to avoid rate limiting
/**
 * The batch size is the number of items that will be processed in parallel in one minute. 
 * Calculate the size of prompts + completion requests and get the number of tokens used.
 * Then divide the number of tokens used by 40k to get the batch size per minute.
 */

export const batchSize = async () => {
    return await batchEstimate() || 50;
}


const example = useExamples ? promptExamples ? promptExamples : [] : [];

export const messageExamples = (chunk: string) => [
    { role: "assistant", content: "Translate the following English text to French" },
    ...example,
    { role: "user", content: chunk }] as ChatCompletionRequestMessage[];

/**
 * model: the model to use for completion
 * example: gpt-3.5-turbo-0301, gpt-3.5-turbo, gpt-4, gpt-4-32k-0314, gpt-4-32k, gpt-4-0314
 */


export const modelSettings = (chunk: string): CreateChatCompletionRequest => ({
    model: 'gpt-3.5-turbo-0301',
    temperature: 0.7,
    max_tokens: 5,
    messages: messageExamples(chunk),
});
