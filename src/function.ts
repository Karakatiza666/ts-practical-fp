
export const compP = <A, B, C>(f: (a: A) => Promise<B>, g: (b: B) => Promise<C>) => (a: A) => f(a).then(g)
export const comp = <A, B, C>(f: (a: A) => B, g: (b: B) => C) => (a: A) => g(f(a))
export const lazy = <Args extends unknown[], R>(f: () => (...args: Args) => R) => (...args: Args) => f()(...args)
export const comp2 = <A, B, C, D>(f: (a: A, b: B) => C, g: (b: C) => D) => (a: A, b: B) => g(f(a, b))
// Lift sync function that throws to a promise
export const liftP = <Args extends unknown[], R>(f: (...args: Args) => Awaited<R>) =>
    async (...args: Args) => f(...args)

export const useP = <A>(f: (a: A) => Promise<void>) => (a: A) => f(a).then(() => a)
export const use = <A>(f: (a: A) => void) => (a: A) => (f(a), a)

export const callNonNull = <Args extends unknown[], R>(f: (...args: [...Args]) => R) => (...args: { [I in keyof Args]: Args[I] | null | undefined }) => {
   // if (args.findIndex(it => typeof it === 'undefined' || it == null) !== -1)
   if (args.findIndex(isNull) !== -1)
      return null
   return f(...args as Args)
}

// https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
export function nonNull<T>(value: T | null | undefined): value is NonNullable<T> {
   return value !== null && value !== undefined;
}

export const isNull = <T>(value: T) =>
   typeof value === 'undefined' || value == null

// export const firstNonNull = <T, R>(f: (t: T) => R | null) => (ts: T[]) =>
//    callNonNull(f, ts.find(t => f(t) !== null) ?? null)
export const firstNonNull = <T, R>(f: (v: T) => R | null) => (array: T[]) => {
   for (const v of array) {
      const r = f(v)
      if (nonNull(r)) {
         return r
      }
   }
   return null
}

// https://stackoverflow.com/questions/27746304/how-to-check-if-an-object-is-a-promise
// Evaluates function asynchronously
export const firstNonNullSequence = <T, R>(f: (v: T) => R | null | Promise<R | null>) => async (array: T[]) => {
   for (const v of array) {
      const r = await f(v)
      if (nonNull(r) && !(r instanceof Error)) {
         return r
      }
   }
   return null
}

export const apply = <Args extends unknown[]>(...args: Args) => <R>(f: (...args: Args) => R) => f(...args)

export const lazyCache = <T>(func: () => T) => {
   let p: T | undefined
   return () => p ?? (p = func())
}