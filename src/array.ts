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

/**
 * 
 * @param arr 
 * @param predicate 
 * @returns [is true, is false]
 */
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

/**
 * Mutates original array, returns same instance
 */
export const pushUnique = <T extends string | number | bigint | boolean | RegExp | Date>(item: T) => (array: T[]) =>
   array.includes(item) ? array : (array.push(item), array)

/**
 * Push items into array, ignoring repeating elements
 * @param items 
 * @returns 
 */
export const pushUniques = <T extends string | number | bigint | boolean | RegExp | Date>(items: T[]) => (array: T[]) => {
   const set = new Set(array)
   for(const i of items) {
      if (set.has(i)) continue
      array.push(i)
   }
   set.clear()
   return array
}

// Mutates original array, returns same instance
export const upsertUniqueOn = <T>(key: (t: T) => string, item: T, combine: (next: T, old: T) => T = a => a) => (array: T[]) => {
   const index = array.findIndex(t => key(item) === key(t))
   if (index >= 0) {
      array[index] = combine(item, array[index])
   } else {
      array.push(item)
   }
   return array
}

// // Mutates original array, returns same instance
// export const pushUniqueOn = <T>(key: (t: T) => string, push: (t: T) => void, item: T) => (array: T[]) =>
//    isUniqueOn(key, item, array) ? (push(item), array) : array
export const pushUniqueOn = <T>(key: (t: T) => string, item: T) => (array: T[]) => {
   const k = key(item)
   return array.find(item => key(item) === k) ? array : (array.push(item), array)
}

// // Mutates original array, returns same instance
// export const pushUniqueWith = <T>(item: T) => (array: T[], f: (item: T) => void, key: (t: T) => string) => {
//    console.log(array)
//    return array.find(t => key(t) == key(item)) ? array : (f(item), array)
// }

// // Assumes passed array is already sorted by key function
// export const upsertSortedWith<T>(key: (t: T) => string, combine: (next: T, old: T) => T, items: T | T[]) => (ts: T[]) => {

// }

export const unionOn = <T>(key: (t: T) => string, combine: (next: T, old: T) => T, as: T[], bs: T[]) => {
   const res = bs.slice()
   for (const a of as) {
      upsertUniqueOn(key, a, combine)(res)
   }
   return res
}

export const binarySearch = <T, K>(
   compare: (a: K, b: K) => number,
   key: (t: T) => K,
   arr: T[],
   target: K,
   startAt = 0,
   endAt = arr.length - 1
 ) => {
   let startIndex = startAt
   let endIndex = endAt
   let index = -1
   let prevIndex = -1
 
   while (startIndex <= endIndex) {
      const midIndex = Math.floor((startIndex + endIndex) / 2)
      const midKey = key(arr[midIndex])
      const compareResult = compare(midKey, target)
      
      if (compareResult === 0) {
         return { index: midIndex, prevIndex: midIndex }
      } else if (compareResult > 0) {
         endIndex = midIndex - 1
         index = midIndex
      } else {
         startIndex = midIndex + 1
         prevIndex = midIndex
      }
   }

   return { index, prevIndex }
}

/**
 * Assumes passed array is already sorted by key function
 * If there are multiple new items with the same key - the order of combinations is not defined, so `combine` should be associative
 * Mutates original array
 * @param compare 
 * @param key 
 * @param combine 
 * @param items 
 * @returns 
 */
export const upsertSortedOnWith_ = <T, K>(compare: (a: K, b: K) => number, key: (t: T) => K, combine: (next: T, old: T) => T, items: T | T[], ts: T[]) => {
   const newItems = Array.isArray(items) ? sortOn_(compare, key, items) : [items]
   const sourceKeyList = ts.map((t) => key(t))
   let prevIndex = -1

   for (let i = 0; i < newItems.length; i++) {
      const newItem = newItems[i]
      const newItemKey = key(newItem)

      const { index, prevIndex: nextPrevIndex } = binarySearch(
         compare,
         key,
         ts,
         newItemKey,
         prevIndex + 1,
         ts.length - 1
      )

      if (index !== -1 && compare(newItemKey, key(ts[index])) === 0) {
         ts[index] = combine(newItem, ts[index])
      } else {
         ts.splice(nextPrevIndex + 1, 0, newItem)
         sourceKeyList.splice(nextPrevIndex + 1, 0, newItemKey)
      }

      prevIndex = nextPrevIndex - 1 // Allow the same index be updated if newItems contains multiple elements with the same key
   }

   return ts
}


/**
 * Assumes passed array is already sorted by key function
 * If there are multiple new items with the same key - the order of combinations is not defined, so `combine` should be associative
 * @param compare 
 * @param key 
 * @param combine 
 * @param items 
 * @returns 
 */
export const upsertSortedOnWith = <T, K>(compare: (a: K, b: K) => number, key: (t: T) => K, combine: (next: T, old: T) => T, items: T | T[], ts: T[]) =>
   upsertSortedOnWith_(compare, key, combine, items, ts.slice())

/**
 * Mutates original array
 * @param compare 
 * @param key 
 * @returns 
 */
export const sortOn_ = <T, K>(compare: (a: K, b: K) => number, key: (a: T) => K, as: T[]) => as.sort((a, b) => compare(key(a), key(b)))

/**
 * 
 * @param compare 
 * @param key 
 * @returns 
 */
export const sortOn = <T, K>(compare: (a: K, b: K) => number, key: (a: T) => K, as: T[]) => sortOn_(compare, key, as.slice())

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

export const removeSpliceAll = <T>(arr: T[], pred: (t: T) => boolean) => {
   arr.splice(0, arr.length, ...arr.filter(t => !pred(t)))
}