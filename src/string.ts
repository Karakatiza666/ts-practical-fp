import { apply, nonNull } from "src/function"
import type { Hex } from "ts-binary-newtypes"

export function replaceAll(str: string, replace: string, strwith: string, caseInsensitive = false) {
   if(!caseInsensitive){
      return str.split(replace).join(strwith)
   } else {
      const esc = replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const reg = new RegExp(esc, 'ig')
      return str.replace(reg, strwith)
   }
}

export function functionString(str: () => string) {
   return typeof str === 'string' ? str : str()
}
export function mkFunctionString(str: () => string) {
   return typeof str === 'string'
      ? () => {
           return str
        }
      : str
}

// https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string

export function trim(str: string, ch: string) {
   let start = 0, 
       end = str.length

   while(start < end && str[start] === ch)
       ++start

   while(end > start && str[end - 1] === ch)
       --end

   return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

export function trimStart(str: string, ch: string) {
   let start = 0 
   const end = str.length

   while(start < end && str[start] === ch)
       ++start

   return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

export function trimEnd(str: string, ch: string) {
   const start = 0
   let end = str.length

   while(end > start && str[end - 1] === ch)
       --end

   return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

// Throws if UTF8 encoding fails
export function requireHexToUtf8(s: Hex) {
   const str = s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
      .toUpperCase()
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI
   return decodeURIComponent(
      str
   )
}

// Throws if UTF8 encoding fails
export function maybeHexToUtf8(s: Hex) {
   try {
      return requireHexToUtf8(s)
   } catch {
      return null
   }
}

export const isValidUtf8Hex = (hex: Hex) => {
   try {
      requireHexToUtf8(hex)
      return true
   } catch {
      return false
   }
}

export const modifyString = (mods: ((n: string) => string)[], str: string, pred: (s: string) => boolean) =>
   mods.map(apply(str)).find(pred)

export const capitalizeFirst = (str: string) =>
   str.charAt(0).toUpperCase() + str.slice(1)

export const singletonString = (t: string | string[] | undefined) => (Array.isArray(t) ? t : nonNull(t) ? [t] : []).join('')
export const stringChunks = (s: string, len: number) => {
   if (s.length <= len) return s;
   let start = 0;
   let end = len;
   const chunks = [];
   while (end < s.length) {
      chunks.push(s.substring(start, end));
      start = end;
      end += len;
   }
   chunks.push(s.substring(start));
   return chunks;
};

export function randomStr(length: number) {
   return (chars: string) => {
      let result = '';
      const charsLength = chars.length;
      for (let i = 0; i < length; i++) {
         result += chars.charAt(Math.floor(Math.random() * charsLength));
      }
      return result;
   };
 }