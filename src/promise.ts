import { errorMessage } from "src/error"

export const sleep = (ms: number) => new Promise<never>(r => setTimeout(r, ms))

export const rejectWith = (e: unknown) => Promise.reject(errorMessage(e))

type AwaitFields<T> = {
   [P in keyof T]: T[P] extends Promise<infer U> ? U : T[P]
}
export const parallelObj = async<T extends Record<string, Promise<unknown>>>(obj: T) =>
   Object.fromEntries(await Promise.all(Object.entries(obj).map(e => e[1].then(v => [e[0], v])))) as AwaitFields<T>

// Can't name this `then` because it causes conflict with Svelte or Ionic
export const thendo = <T extends unknown[], R>(f: (...args: T) => R ) => (...t: { -readonly [P in keyof T]: Promise<T[P]>; }) =>
   Promise.all(t).then(async (t): Promise<Awaited<R>> => { return await f(...t) })

export function fulfilledPromise<T>(result: PromiseSettledResult<T>): T | undefined {
   if (result.status === 'fulfilled') {
      return result.value
   } else {
      return undefined
   }
}