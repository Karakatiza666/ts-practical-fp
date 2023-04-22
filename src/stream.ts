
export async function readStreamAsUint8Array(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
   const reader = stream.getReader();
   const chunks: Uint8Array[] = [];
 
   // eslint-disable-next-line no-constant-condition
   while (true) {
      const { done, value } = await reader.read()
      if (done) {
         break
      }
      chunks.push(value)
   }
 
   const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0)
   const result = new Uint8Array(totalLength);
   let offset = 0
 
   for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
   }

   return result
}