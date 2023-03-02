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