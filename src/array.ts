import { nonNull } from "src/function"

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export const compareNumber = <T>(f: (x: T) => number) => (a: T, b: T) => f(a) - f(b)

export const zipWithDefault = <A, B, R>(f: (a: A, b: B) => R, dA: A, dB: B) => (as: A[], bs: B[]) => {
   const len = Math.max(as.length, bs.length)
   const res = new Array<R>(len)
   for (let i = 0; i < len; ++i) {
      res[i] = f(as[i] ?? dA, bs[i] ?? dB)
   }
   return res
}

// First elem - pred is true, second - false
export const partition = <T>(
   arr: T[],
   predicate: (v: T, i: number, ar: T[]) => boolean
) =>
   arr.reduce(
      (acc, item, index, array) => {
         acc[+!predicate(item, index, array)].push(item);
         return acc;
      },
      [[], []] as [T[], T[]]
)

export const uniqueUnordered = <T>(arr: T[]) => Array.from(new Set(arr))
export const unique = <T>(arr: T[]) => {
   const set = new Set<T>()
   const result = [] as T[]
   for (const e of arr) {
      if (!set.has(e)) {
         set.add(e)
         result.push(e)
      }
   }
   return result
}
export const uniqueOn = <T>(fn: (x: T) => string) => (arr: T[]) => {
   const set = new Set<string>()
   const result = [] as T[]
   for (const e of arr) {
      const str = fn(e)
      if (!set.has(str)) {
         set.add(str)
         result.push(e)
      }
   }
   return result
}
export const uniqueOn_ = <T>(fn: (x: T) => string, arr: T[]) => {
   const set = new Set<string>()
   const result = [] as T[]
   for (const e of arr) {
      const str = fn(e)
      if (!set.has(str)) {
         set.add(str)
         result.push(e)
      }
   }
   return result
}

export const groupBy = <T, R = T>(array: T[], predicate: (v: T) => string, result = (v: T) => v as unknown as R) =>
   Object.entries(array.reduce((acc, value) => {
      (acc[predicate(value)] ||= []).push(result(value))
      return acc
   }, {} as { [key: string]: R[] }))

export const firstResult = <T, R>(array: T[], predicate: (v: T) => R) => {
   for (let i = 0; i < array.length; ++i) {
      const r = predicate(array[i])
      if (r) {
         return r
      }
   }
   return undefined
}

export const diff1 = <T>(getKey: (t: T) => string, as: T[], b: T) => {
   const kb = getKey(b)
   return as.filter(a => getKey(a) !== kb)
}

export const randomOf = <T>(items: T[]) => items.length == 0 ? null : items[Math.floor(Math.random()*items.length)]

export const singleNonNull = <T>(item: T | null | undefined) => item ? [item] : []

export const isUniqueOn = <T>(f: (t: T) => string, item: T, array: T[]) =>
   !array.find(i => f(i) == f(item))

// Mutates original array, returns same instance
export const pushUnique = <T extends string | number | bigint | boolean | RegExp | Date>(item: T) => (array: T[]) =>
   array.includes(item) ? array : (array.push(item), array)

// Mutates original array, returns same instance
export const upsertUniqueOn = <T>(key: (t: T) => string, item: T) => (array: T[]) =>
   array.find(t => key(item) == key(t)) ? array.map(t => (key(item) == key(t) ? item : t)) : (array.push(item), array)
   // (elem => (elem ? (elem = item) : array.push(item), array))(array.find(t => key(item) == key(t)))

// // Mutates original array, returns same instance
// export const pushUniqueOn = <T>(key: (t: T) => string, push: (t: T) => void, item: T) => (array: T[]) =>
//    isUniqueOn(key, item, array) ? (push(item), array) : array

// // Mutates original array, returns same instance
// export const pushUniqueWith = <T>(item: T) => (array: T[], f: (item: T) => void, key: (t: T) => string) => {
//    console.log(array)
//    return array.find(t => key(t) == key(item)) ? array : (f(item), array)
// }

export function includesAny (str: string, arr: string[]) {
   let regex = / /
   let found = false;
   for (let i = 0, l = arr.length; i < l; i++) {
     regex = new RegExp(arr[i], 'g');
     if (regex.test(str)) { found = true; break; }
   }
   return found;
};

export function assertUnion <T extends readonly string[]>(
   union: T, val: string, msg = `${val} is not in the union!`):
   asserts val is typeof union[number] {
   if (!union.includes(val)) throw new Error(msg)
}

export const singleton = <T>(t: T | T[] | undefined) => Array.isArray(t) ? t : nonNull(t) ? [t] : []

export const andArr = (arr: boolean[]) => arr.every(b => b)
export const orArr = (arr: boolean[]) => !!arr.find(b => b)