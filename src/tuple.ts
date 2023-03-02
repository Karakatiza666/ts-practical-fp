

export function tuple<T extends unknown[]>(...t: [...T]) {
   return t
}

export function tuples<T extends unknown[]>(t: [...T][]) {
   return t
}

export const zip = <A, B>(a: A[], b: B[]) => a.map((k, i) => [k, b[i]] as [A, B])