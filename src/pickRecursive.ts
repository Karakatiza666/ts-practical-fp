// export type PickRecursive_<E, R> = (e: E, func: ((getResult: PickRecursive_<E, R>) => Promise<R | null>)) => Promise<R | null>

import { nonNull } from "src/function"

// export type PickRecursive<E, R> = (picker: (e: E, func: PickRecursive<E, R>) => Promise<R | null>) => Promise<R | null>
export type PickRecursive_<E, R> = (e: E, func: PickRecursive<E, R>) => Promise<R | null>
export type PickRecursive<E, R> = (getResult: PickRecursive_<E, R>) => Promise<R | null>

export const pickRecursive = <E>(getIterator: () => () => Promise<E | null>, getKey: (e: E) => string) => {
   const used = new Set<string>()
   const impl = async <R>(getResult: PickRecursive_<E, R>) => {
      let result: R | null = null
      let elem: E | null = null
      const getNext = getIterator()
      do {
         elem = await getNext()
         if (!elem) {
            break
         }
         const key = getKey(elem)
         if (used.has(key)) continue
         const recurse: PickRecursive<E, R> = (f) => (used.add(key), impl(f))
         result = await getResult(elem, recurse)
         if (!result) {
            used.delete(key)
         }
      } while (!result && elem)
      return result
   }
   return impl
}

// export type PickRecursiveIgnore_<E, R> = (e: E, func: ((ignore: E[], getResult: PickRecursiveIgnore_<E, R>) => Promise<R | null>)) => Promise<R | null>
// export type PickRecursiveIgnore<E, R> = (ignore: E[], getResult: (e: E, func: PickRecursiveIgnore<E, R>) => Promise<R | null>) => Promise<R | null>
export type PickRecursiveIgnore_<E, R> = (e: E, func: PickRecursiveIgnore<E, R>) => Promise<R | null>
export type PickRecursiveIgnore<E, R> = (ignore: E[], getResult: PickRecursiveIgnore_<E, R>, onSearchEnd?: (func: PickRecursiveIgnore<E, R>) => Promise<R | null>) => Promise<R | null>

// type InputPicker = (
//       toIgnore: TransactionInput[],
//       picker: (pickInput: InputPicker, input: TransactionUnspentOutput) => BuilderResult
//    ) => BuilderResult


const isValidResult = <R>(r: R | Error | null): r is R => nonNull(r) && !(r instanceof Error)

// Before each step a list of elements to ignore can be added
export const pickRecursiveIgnore = <E>(getIterator: () => () => Promise<E | null>, getKey: (e: E) => string) => {
   const used = new Set<string>()
   // const impl = async <R>(ignore: E[], getResult: PickRecursiveIgnore_<E, R>, onSearchEnd?: () => Promise<R | null>) => {
   const impl = async <R>(ignore: E[], getResult: PickRecursiveIgnore_<E, R>, onSearchEnd?: (func: PickRecursiveIgnore<E, R>) => Promise<R | null>): Promise<R | null> => {
      ignore.forEach(e => used.add(getKey(e)))
      let result: R | null = null
      let elem: E | null = null
      const getNext = getIterator()
      // console.log('pick input recurse')
      while (!isValidResult(result) && (elem = await getNext())) {
         // console.log('pickInput next')

         const key = getKey(elem)
         if (used.has(key)) {
            // console.log('pickInput elem already used!')
            continue
         }
         
         result = await getResult(elem, (ignore, f, end) => {
            console.log('used utxos: ', used.add(key))
            return (used.add(key), impl(ignore, f, end))})
         if (!isValidResult(result)) {
            console.log('used utxo deleted : ', key)
            used.delete(key)
         }
      }
      if (!isValidResult(result) && onSearchEnd) {
         result = await onSearchEnd(impl)
      }
      return result
   }
   return impl
}

// // Pick inputs with pickNext function while it returns true
// Allows to pick as many inputs with the same algorithm as needed
// example:
// `async (input, pickInput, pickNext) => { ... `
// when current input doesn't fit:
// `return null`
// when input found, and need to find another input:
// `return pickInput([], pickNext)`
// when it's time to continue to the next parts of the transaction:
// `return pickInput([], ...)` or `return complete(builder)`
export function pickAnotherElement<E, Result>(
   // ctx: { protocolParams: ProtocolParams },
   // inputPicker: PickRecursiveIgnore<E, Result>,
   pickNext: (input: E, pickInput: PickRecursiveIgnore<E, Result>, pickAnother: PickRecursiveIgnore_<E, Result> /* () => Promise<Result | null>*/) => Promise<Result | null>,
   // finishTx: (inputPicker: PickRecursiveIgnore_<E, Result>) => Promise<Result | null>):
   ): // finishTx: PickRecursiveIgnore_<E, Result>):
   PickRecursiveIgnore_<E, Result> {
   const pickAnother: PickRecursiveIgnore_<E, Result> = async (input, inputPicker) => {
      // return pickNext(input, () => inputPicker([], picker))
      return pickNext(input, inputPicker, pickAnother)
   }
   return pickAnother
}