function gcd(a: number, b: number): number {
	return b ? gcd(b, a % b) : a
}

export function toFraction(_decimal: number) {
   if (_decimal == parseInt(_decimal.toString())) {
      return {
         numerator: _decimal,
         denominator: 1,
      }
   }
   else {
      let numerator = _decimal.toString().includes(".") ? _decimal.toString().replace(/\d+[.]/, '') : 0
      const denominator = Math.pow(10, numerator.toString().replace('-','').length)
      if (_decimal >= 1) {
         numerator = +numerator + (Math.floor(_decimal) * denominator)
      }
      else if (_decimal <= -1) {
         numerator = +numerator + (Math.ceil(_decimal) * denominator)
      }
      const x = Math.abs(gcd(+numerator, denominator))
      return {
         numerator: +numerator / x,
         denominator: denominator / x,
      }
   }
}

/**
 * Clamp a number
 * @param number 
 * @param min inclusive minimum
 * @param max inclusive maximum
 * @returns 
 */
export function clamp(number: number, min: number, max: number) {
   return Math.max(min, Math.min(number, max))
}

export const discreteDerivative = <T, R>(arr: T[], f: (n1: T, n0: T) => R) => {
   // return arr.slice(1).map((x, i) => f(x, arr[i]))
   if (!arr.length) {
      return []
   }
   const
      len = arr.length - 1,
      result = new Array<R>(len)
   for (let i = 0; i < len; ++i) {
      result[i] = f(arr[i + 1], arr[i])
   }
   return result
}