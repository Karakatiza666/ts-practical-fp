export const errorMessage = (e: any) => e.message ?? e.info ?? e.error ?? (typeof e === 'string' ? e : JSON.stringify(e))

export const assertThat = <T>(f: (v: T) => boolean) => (v: T) => {
   if (!f(v)) {
      throw new Error(`assertThat: ${f.name} false`);
   }
   return v
}
