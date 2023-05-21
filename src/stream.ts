
export async function reduceStream<T, V, S>(stream: ReadableStream<T>, collect: (acc: S, cur: T) => S, aggregate: (acc: S) => V, initial: S): Promise<V> {
   const reader = stream.getReader()
   let acc = initial

   // eslint-disable-next-line no-constant-condition
   while (true) {
      const { done, value } = await reader.read()
      if (done) {
         break
      }
      acc = collect(acc, value)
   }

   return aggregate(acc)
}