import { firstNonNullSequence, nonNull } from "src/function"

export const paginatedLookupAll = async <T>({pageSize, startPage, getBatch, pred}: {
   pageSize: number
   startPage: number
   getBatch: (params: {page: number}) => Promise<T[]>
   pred: (t: T) => boolean
}) => {
   const result = [] as T[]
   let batch: T[]
   do {
      batch = await getBatch({page: startPage++})
      result.push(...batch.filter(pred))
   } while (batch.length === pageSize)
   return result
}

// Returns first value that satisfies the predicate or null, and a list of searched items that includes that value
export const paginatedLookupMaybe = async <T>(
   {pageSize, startPage = 0, getBatch, pred}: {
   pageSize: number
   startPage?: number
   getBatch: (params: {page: number}) => Promise<T[]>
   pred: (t: T) => boolean
}) => {
   const searched = [] as T[]
   let result: T | undefined
   let batch: T[]
   do {
      batch = await getBatch({page: startPage++})
      searched.push(...batch)
      result = batch.find(pred)
   } while (batch.length === pageSize && result !== undefined)
   return {result, searched}
}

// Returns first value that satisfies the predicate and a list of searched items that includes that value
// Rejects if value not found
export const paginatedLookupFirst = async <T>(
   { message = "Paginated lookup didn't find target!", ...params}: {
   pageSize: number
   startPage?: number
   getBatch: (params: {page: number}) => Promise<T[]>
   pred: (t: T) => boolean
   message?: string
}) => paginatedLookupMaybe(params).then(r => r.result !== undefined
   ? {result: r.result as T, searched: r.searched}
   : Promise.reject(new Error(message)))

// // Returns first non-null result of a function or null, and a list of searched values that include found value
// export const paginatedLookupMaybeNonNull = async <T, R>(
//    {pageSize, startPage, getBatch, func}: {
//    pageSize: number
//    startPage: number
//    getBatch: (params: {page: number}) => Promise<T[]>
//    func: (t: T) => R | null
// }) => {
//    const searched = [] as T[]
//    let result: R | null
//    let batch: T[]
//    do {
//       batch = await getBatch({page: startPage++})
//       searched.push(...batch)
//       result = firstNonNull(func)(batch)
//    } while (batch.length === pageSize && nonNull(result))
//    return {result, searched}
// }

// // Returns first non-null result of a function, and a list of searched items that includes that value
// // Rejects if result not found
// export const paginatedLookupFirstNonNull = async <T, R>(
//    { message = "Paginated lookup didn't find target!", ...params}: {
//    pageSize: number
//    startPage: number
//    getBatch: (params: {page: number}) => Promise<T[]>
//    func: (t: T) => R | null
//    message?: string
// }) => paginatedLookupMaybeNonNull(params).then(r => nonNull(r.result)
//    ? {result: r.result, searched: r.searched}
//    : Promise.reject(new Error(message)))


// Returns first non-null result of a function or null, and a list of searched values that include found value
export const paginatedLookupMaybeNonNull = async <T, R>(
   {pageSize, startPage = 0, getBatch, func}: {
   pageSize: number
   startPage?: number
   getBatch: (params: {page: number}) => Promise<T[]>
   func: ((t: T) => Promise<R | null>) | ((t: T) => R | null)
}) => {
   const searched = [] as T[]
   let result: R | null
   let batch: T[]
   do {
      batch = await getBatch({page: startPage++})
      searched.push(...batch)
      result = await firstNonNullSequence(func)(batch)
      console.log('Intermediate result', result)
   } while (batch.length === pageSize && (nonNull(result) && !(result instanceof Error)))
   return {result, searched}
}

// Returns first non-null result of a function, and a list of searched items that includes that value
// Rejects if result not found
export const paginatedLookupFirstNonNull = async <T, R>(
   { message = "Paginated lookup didn't find target!", ...params}: {
   pageSize: number
   startPage?: number
   getBatch: (params: {page: number}) => Promise<T[]>
   // func: (t: T) => R extends Promise<unknown> ? Promise<Awaited<R> | null> : (R | null)
   // func: R extends Promise<infer _P | null> ? (t: T) => R : (t: T) => R | null
   func: ((t: T) => Promise<R | null>) | ((t: T) => R | null)
   message?: string
}) => paginatedLookupMaybeNonNull(params).then(r => nonNull(r.result)
   ? {result: r.result, searched: r.searched}
   : Promise.reject(new Error(message)))

// export function paginatedIterator<T>(getPage: () => Promise<T[]>): () => AsyncIterable<T> {
//    let cache: T[] = [];
//    let cacheIndex = 0;

//    async function* getNext(): AsyncIterable<T> {
//       while (true) {
//          if (cacheIndex >= cache.length) {
//            cache = await getPage();
//            cacheIndex = 0;
//          }
//          yield cache[cacheIndex++];
//       }
//    }

//    return () => getNext();
// }

// export function paginatedIterator<T>(getPage: () => Promise<T[]>) {
//    const cache: T[] = [];
//    let currentIndex = 0;

//    async function getNext() {
//       if (currentIndex >= cache.length) {
//          const batch = await getPage();
//          cache.push(...batch);
//       }
//       return cache[currentIndex++];
//    }

//    return function() {
//       currentIndex = 0;
//       return getNext;
//    }
// }

export function paginatedIterator<T>(pageSize: number, getPage: () => Promise<T[]>) {
   const cache: T[] = [];
   let fetchedPage = 0;

   return function() {
      let currentIndex = 0;

      async function getNext() {
         if (currentIndex >= cache.length) {
            if (cache.length < fetchedPage * pageSize) {
               return null;
            }
            const batch = await getPage();
            fetchedPage++
            cache.push(...batch);
         }
         return cache[currentIndex++];
      }

      return getNext;
   }
}

// Returns only empty array after all elements have been fetched
export function createPaginator<T>(pageSize: number, getPage: (params: {page: number}) => Promise<T[]>) {
   let currentPage = 0
   let totalNumber = 0

   async function getNextBatch() {
      if (currentPage * pageSize > totalNumber) {
         return []
      }
      const batch = await getPage({page: currentPage++})
      totalNumber += batch.length
      return batch
   }

   return getNextBatch
}

// Returns only null when all elements have been fetched
export function createNullishPaginator<T>(pageSize: number, getPage: (params: {page: number}) => Promise<T[]>) {
   let currentPage = 0
   let totalNumber = 0

   async function getNextBatch() {
      if (currentPage * pageSize > totalNumber) {
         return null
      }
      const batch = await getPage({page: currentPage++})
      totalNumber += batch.length
      if (batch.length == 0) {
         return null
      }
      return batch
   }

   return getNextBatch
}