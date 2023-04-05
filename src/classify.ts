
export async function* classify<T, Args>
   (elems: T[], ...classifiers: Array<(arg: T) => Promise<[string, Args] | null>>): AsyncGenerator<[string, Args], void, unknown> {
   const results = elems.map(elem => 
      (async function*() {
         for (const classifier of classifiers) {
           const result = await classifier(elem);
            if (result) {
               yield result;
               return;
            }
         }
         throw new Error(`classify failed: no classifier returned for ${JSON.stringify(elem)}!`)
      })()
   );
   for (const generator of results) {
      for await (const item of generator) {
         yield item
      }
   }
}

/*
   The classify function is declared as an async generator function, which allows the results to be yielded
as soon as they become available.
   The map function is used to create an async generator function for each item. Inside these, the for...of loop
is used to apply each classifier to the item, and the await keyword is used to wait for the classifier to
return a result. When a classifier returns a defined value, the result is yielded, and the generator function
returns. If all classifiers return undefined, the element is returned with class "other".
   The outer for-loop iterates over the results array, which is an array of async generator functions. The inner
for-await-of loop iterates over each generator function, and yields the results as soon as they are available.
   This way all elements are classified simultaneously, and the generator yields the results as soon as they are
available, without waiting for all classifications to be done.
*/

export async function* classifyPar<T, Args>(
   elems: T[],
   ...classifiers: Array<(arg: T) => Promise<[string, Args] | null>>
): AsyncGenerator<[string, Args], void, unknown> {
   const results = elems.map((elem) =>
      (async function () {
         for (const classifier of classifiers) {
            const result = await classifier(elem)
            if (result) {
               return result
            }
         }
         throw new Error(`classify failed: no classifier returned for ${JSON.stringify(elem)}!`)
      })()
   )
   for await (const result of results) {
      yield result
   }
}