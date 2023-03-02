
// https://stackoverflow.com/questions/69535948/does-typescript-support-a-true-xor-union-between-object-types
export type UnionKeys<T> = T extends T ? keyof T : never;
export type StrictUnionHelper<T, TAll> =
  T extends any
  ? Partial<T> & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;

export type StrictUnion<T> = StrictUnionHelper<T, T>
export type OptionalIntersection<T> = StrictUnionHelper<T, T>