import { isHex } from "ts-binary-newtypes"

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