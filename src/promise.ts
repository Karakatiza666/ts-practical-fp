import { errorMessage } from "src/error"

export const sleep = (ms: number) => new Promise<never>(r => setTimeout(r, ms))

export const rejectWith = (e: unknown) => Promise.reject(errorMessage(e))

type AwaitFields<T> = {
   [P in keyof T]: T[P] extends Promise<infer U> ? U : T[P]
}
export const parallelObj = async<T extends Record<string, Promise<unknown>>>(obj: T) =>
   Object.fromEntries(await Promise.all(Object.entries(obj).map(e => e[1].then(v => [e[0], v])))) as AwaitFields<T>
