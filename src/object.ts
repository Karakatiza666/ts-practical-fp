export type addPrefixToObject<T, P extends string> = {
   [K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
}

export type AnyPrefixed<P extends string, T> = addPrefixToObject<Record<string, T>, P>

export const mapObj = <V, R>(f: (v: V, k: string) => R) => (obj: Record<string, V>) =>
   Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v, k)]))

export const mapObj_ =  <V>(obj: Record<string, V>) => <R>(f: (v: V, k: string) => R) => 
   Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v, k)]))

// Returns a shallow copy of the object
export function filterObject<K extends string | number | symbol, V>
   (obj: Record<K, V>, pred: (v: V, k: K) => boolean) {
   obj = {...obj}
   Object.entries<V>(obj).forEach(([key, val]) => {
      if (!pred(val, key as K)) {
         delete obj[key as K]
      }
   })
   return obj
}
// export function filterObject<K extends string | number | symbol, V>(
//    obj: Record<K, V | undefined | null>, pred: (v: V | undefined | null, k: K) => boolean
// ) {
//    const filteredObj: Partial<Record<K, V>> = {};
//    Object.entries<V | undefined | null>(obj).forEach(([key, val]) => {
//       if (val !== undefined && val !== null && pred(val, key)) {
//          filteredObj[key as unknown as K] = val as V;
//       }
//    });
//    return filteredObj as Record<K, V>;
// }
export const filterObject_ = (pred: (v: unknown, k: string) => boolean) => (obj: Record<string, unknown>) => {
   obj = {...obj}
   Object.entries(obj).forEach(([key, val]) => {
      if (!pred(val, key)) {
         delete obj[key]
      }
   })
   return obj
}

export const isEmptyObj = (obj: object) => Object.keys(obj).length === 0

export function objectAny<K extends string | number | symbol, V>
   (obj: Record<K, V>, pred: (v: V) => boolean) {
   return Object.entries<V>(obj).findIndex(([, val]) => pred(val)) !== -1
}

export function objectFirst<K extends string | number | symbol, V>
   (obj: Record<K, V>, pred: (v: V) => boolean) {
   return Object.entries<V>(obj).find(([, val]) => pred(val))
}

export const objectArray = <T>(o: Record<number, T>) =>
   Object.keys(o).map(index => o[index as unknown as number] as T)

// type OmitPrefix<T, Prefix extends string> = {
//    [P in Exclude<keyof T, keyof Pick<T, { [K in keyof T]: T[K] extends object ? K : never }[keyof T]>>]: T[P]
// };
type OmitPrefix<T, Prefix extends string> = Pick<T, { [P in keyof T]: P extends Prefix ? never : P }[keyof T]>;

// function omitPrefixFields<T extends { [s: string]: T[keyof T]; }, Prefix extends string>(obj: T, prefix: Prefix): OmitPrefix<T, Prefix> {
//    const filteredObj = {} as OmitPrefix<T, Prefix>;
//    Object.entries<T[keyof T]>(obj).forEach(([key, val]) => {
//       if (!key.startsWith(prefix)) {
//          filteredObj[key as Exclude<keyof T, keyof Pick<T, { [K in keyof T]: T[K] extends object ? K : never }[keyof T]>>] = val;
//       }
//    });
//    return filteredObj;
// }
export function omitPrefixFields<T extends { [s: string]: unknown; }, Prefix extends string>(obj: T, prefix: Prefix): OmitPrefix<T, Prefix> {
   const filteredObj = {} as Record<string, unknown>;
   Object.entries(obj).forEach(([key, val]) => {
      if (!key.startsWith(prefix)) {
         // filteredObj[key as Exclude<keyof T, keyof Pick<T, { [K in keyof T]: K extends Prefix ? K : never }[keyof T]>>] = val;
         filteredObj[key] = val;
      }
   });
   return filteredObj as OmitPrefix<T, Prefix>;
}