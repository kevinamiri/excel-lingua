
import { OpenAIApi } from 'openai';

type AsyncFunction = (...args: any[]) => Promise<any>;

export function retryWithExponentialBackoff(
    func: AsyncFunction,
    initialDelay: number = 1,
    exponentialBase: number = 2,
    jitter: boolean = true,
    maxRetries: number = 10,
    errors: any[] = ['RateLimitError'],
): AsyncFunction {
    // Retry a function with exponential backoff
    return async function wrapper(...args: any[]) {
        // Initialize variables
        let numRetries = 0;
        let delay = initialDelay;

        // Loop until a successful response or maxRetries is hit or an exception is raised
        while (true) {
            try {
                return await func(...args);
            } catch (e) {
                // Retry on specific errors
                if (errors.includes(e.name)) {
                    // Increment retries
                    numRetries += 1;

                    // Check if max retries has been reached
                    if (numRetries > maxRetries) {
                        throw new Error(`Maximum number of retries (${maxRetries}) exceeded.`);
                    }

                    // Increment the delay
                    delay *= exponentialBase * (1 + (jitter ? Math.random() : 0));

                    // Sleep for the delay
                    await new Promise(resolve => setTimeout(resolve, delay * 1000));
                } else {
                    // Raise exceptions for any errors not specified
                    throw e;
                }
            }
        }
    }
}