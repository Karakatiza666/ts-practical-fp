import { isHex } from "ts-binary-newtypes"
import { reduceStream } from "./stream";
// import * as getRandomBytes from 'randombytes'

// ===================================================
export function bytesEq(a_: ArrayBuffer|ArrayBufferView, b_: ArrayBuffer|ArrayBufferView){
   const a: ArrayBufferView = a_ instanceof ArrayBuffer ? new Uint8Array(a_, 0) : a_
   const b: ArrayBufferView = b_ instanceof ArrayBuffer ? new Uint8Array(b_, 0) : b_
   if (a.byteLength != b.byteLength) return false;
   if (aligned32(a) && aligned32(b))
     return equal32(a, b);
   if (aligned16(a) && aligned16(b))
     return equal16(a, b);
   return equal8(a, b);
}

function equal8(a: ArrayBufferView, b: ArrayBufferView) {
   const ua = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
   const ub = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
   return compare(ua, ub);
}
function equal16(a: ArrayBufferView, b: ArrayBufferView) {
   const ua = new Uint16Array(a.buffer, a.byteOffset, a.byteLength / 2);
   const ub = new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2);
   return compare(ua, ub);
}
function equal32(a: ArrayBufferView, b: ArrayBufferView) {
   const ua = new Uint32Array(a.buffer, a.byteOffset, a.byteLength / 4);
   const ub = new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
   return compare(ua, ub);
}

function compare<T extends Uint8Array | Uint16Array | Uint32Array>(a: T, b: T) {
   for (let i = a.length; -1 < i; i -= 1) {
     if ((a[i] !== b[i])) return false;
   }
   return true;
}

function aligned16(a: ArrayBufferView) {
   return (a.byteOffset % 2 === 0) && (a.byteLength % 2 === 0);
}

function aligned32(a: ArrayBufferView) {
   return (a.byteOffset % 4 === 0) && (a.byteLength % 4 === 0);
}
// ===================================================

/**
 * Not cryptographically secure
 * @param len bytes count
 * @returns function that takes max byte value and returns random bytes
 */
export const randomBytes = (len: number) => {
   return (_max?: number) => {
      let result = new Uint8Array(len);
      const max = Math.max(0, Math.min(_max || 255, 255))
      for (let i = 0; i < len; ++i) {
         result[i] = Math.floor(Math.random() * max)
      }
      return result
   }
}

/**
 * Cryptographically secure
 * @param len bytes count
 * @returns function that takes max byte value and returns random bytes
 */
export const randomCryptoBytes = (len: number) => {
   return (_max?: number) => {
      const max = Math.max(0, Math.min(_max || 255, 255))
      // return ((getRandomBytes as any).default as typeof getRandomBytes)(len).map(v => v % max)
      const bytes = new Uint8Array(len)
      return crypto.getRandomValues(bytes).map(v => v % max)
   }
}

export function convertBase64ToBuffer(base64Image: string) {
   // Split into two parts
   const parts = base64Image.split(';base64,');

   // Decode Base64 string
   const decodedData = window.atob(parts[1]);

   // Create UNIT8ARRAY of size same as row data length
   const uInt8Array = new Uint8Array(decodedData.length);

   // Insert all character code into uInt8Array
   for (let i = 0; i < decodedData.length; ++i) {
     uInt8Array[i] = decodedData.charCodeAt(i);
   }

   return uInt8Array
}

export function convertBase64ToBuffer_(base64Image: string) {
   return fetch(base64Image).then(c => c.arrayBuffer()).then(b => new Uint8Array(b))
}

export function convertBase64ToBlob(base64Image: string) {
   // Split into two parts
   const parts = base64Image.split(';base64,');

   // Hold the content type
   const imageType = parts[0].split(':')[1];

   // Decode Base64 string
   const decodedData = window.atob(parts[1]);

   // Create UNIT8ARRAY of size same as row data length
   const uInt8Array = new Uint8Array(decodedData.length);

   // Insert all character code into uInt8Array
   for (let i = 0; i < decodedData.length; ++i) {
     uInt8Array[i] = decodedData.charCodeAt(i);
   }

   // Return BLOB image after conversion
   return new Blob([uInt8Array], { type: imageType });
}

export const isArrayBuffer = (value: unknown): value is ArrayBuffer =>
   !!value && value instanceof ArrayBuffer && value.byteLength !== undefined;

export const leqByteSize = (maxBytes: number) => (asset: string | ArrayBuffer | Blob) => {
   if (typeof asset === 'string') {
      const lenMultiplier =
         isHex(asset) ? 2   // hex
                      : 4/3 // base64
      return asset.length <= maxBytes * lenMultiplier
   } else if (isArrayBuffer(asset)) {
      return asset.byteLength <= maxBytes
   } else {
      return asset.size <= maxBytes
   }
}

export const kilobytes = (n: number) => Math.floor(n * 1024)
export const megabytes = (n: number) => Math.floor(n * 1024 * 1024)

export const showKib = (n: number) => Math.ceil(n / 1024)
export const showMib = (n: number) => Math.ceil(n / 1024 / 1024)

export const collectBytes = (acc: Uint8Array[], cur: Uint8Array) =>
   (acc.push(cur), acc)

export const aggregateBytes = (acc: Uint8Array[]) => {
   const totalLength = acc.reduce((total, chunk) => total + chunk.length, 0)
   const result = new Uint8Array(totalLength);
   let offset = 0
 
   for (const chunk of acc) {
      result.set(chunk, offset)
      offset += chunk.length
   }

   return result
}

export const readStreamAsUint8Array = (s: ReadableStream<Uint8Array>) => reduceStream(s, collectBytes, aggregateBytes, [])