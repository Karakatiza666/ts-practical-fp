

export function tuple<T extends unknown[]>(...t: [...T]) {
   return t
}

export function tuples<T extends unknown[]>(t: [...T][]) {
   return t
}

/**
 * Taken from https://stackoverflow.com/a/70192772
 * @param arr Arrays to zip
 * @returns 
 */
export function zip<T extends unknown[][]>(
   ...args: T
): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
   const minLength = Math.min(...args.map((arr) => arr.length))
   // @ts-expect-error This is too much for ts
   return Array(minLength).fill(undefined).map((_, i) => args.map((arr) => arr[i]))
}

/**
 * Taken from https://stackoverflow.com/a/72650077
 * @param arr An array of tuples to unzip into arrays
 * @returns 
 */
export function unzip<
  T extends [...{ [K in keyof S]: S[K] }][], S extends any[]
>(arr: [...T]): T[0] extends infer A 
  ? { [K in keyof A]: T[number][K & keyof T[number]][] } 
  : never 
{
   const maxLength = Math.max(...arr.map((x) => x.length))

   return arr.reduce(
      (acc: any, val) => {
         val.forEach((v, i) => acc[i].push(v))
         return acc;
      },
      Array(maxLength).fill([])
   )
}