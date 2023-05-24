
type AsyncFunction = (...args: any[]) => Promise<any>;

export function retryWithExponentialBackoff(
    func: AsyncFunction,
    initialDelay: number = 1,
    exponentialBase: number = 2,
    jitter: boolean = true,
    maxRetries: number = 10,
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
                if (e.response && e.response.status === 429 || e.response.status === 500) {
                    // Increment retries
                    numRetries += 1;
                    //next retry in ${delay} seconds
                    console.log(`Retrying in ${delay} seconds... Retry attempt ${numRetries} of ${maxRetries}`)

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
                    throw e.response.data;
                }
            }
        }
    }
}
