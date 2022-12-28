/**
 * Retry a function until it succeeds or until a timeout is reached.
 *
 * @param f - The function to retry.
 *  The function will receive the retry number as the first argument (starting at 0) and should return a promise.
 * @param timeout - The timeout in milliseconds.
 *  Note that the timeout will only be evaluated after the async function finishes.
 *  If you want to abort the function after a certain time, you need to implement that logic in the function itself, e.g. by using the `p-timeout` npm package.
 * @returns The result of the function.
 */
export async function retryUntilTimeout<T>(
  f: (retryNumber: number) => T,
  timeout = 15000,
) {
  const start = Date.now()
  let i = 0
  for (;;) {
    try {
      return await f(i++)
    } catch (error) {
      if (Date.now() - start > timeout) {
        throw error
      } else {
        const timeToWait = 100 + (Date.now() - start) / 10
        await new Promise((r) => setTimeout(r, timeToWait))
      }
    }
  }
}
