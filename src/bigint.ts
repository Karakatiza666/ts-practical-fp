/**
 * Convert a bigint to a 64 bit Little-Endian bytestring.
 * Negative values are converted to a two's complement.
 * @param value 
 * @returns 
 */
export function bigIntToLittleEndian(value: bigint) {
   const buf = new Uint8Array(8);
   let isNegative = false;
   if (value < 0n) {
      isNegative = true;
      value = -value;
   }
   for (let i = 0; i < 8; i++) {
      buf[i] = Number(value & 0xffn);
      value >>= 8n;
   }
   if (isNegative) {
      let carry = 1;
      for (let i = 0; i < 8; i++) {
         const complement = (buf[i] ^ 0xFF) + carry;
         buf[i] = complement & 0xFF;
         carry = complement >> 8;
      }
   }
   return buf;
}

/**
 * Convert 64 bit Little-Endian integer to BigInt.
 * Negative values are converted from a two's complement.
 * @param value 
 * @returns 
 */
export function littleEndianToBigInt(buffer: Uint8Array, offset = 0) {
   let value = 0n;
   let sign = 1n;
   // Check if the most significant bit is set (sign bit)
   if (buffer[offset + 7] & 0x80) {
      // Negative number
      sign = -1n;
      // Perform two's complement conversion
      let carry = 1;
      for (let i = 0; i < 8; i++) {
         const complement = (buffer[offset + i] ^ 0xFF) + carry;
         value += BigInt(complement & 0xFF) << (BigInt(i) * 8n);
         carry = complement >> 8;
      }
   }
   else {
      // Positive number
      for (let i = 0; i < 8; i++) {
         value += BigInt(buffer[offset + i]) << (BigInt(i) * 8n);
      }
   }
   return value * sign;
}