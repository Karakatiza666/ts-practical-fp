export class KeyedSet<K extends number | string | symbol, T> implements ArrayLike<T> {
   private map = new Map<K, T>();

   constructor(private getKey: (item: T) => K) {}
   readonly [n: number]: T;

   add(item: T) {
     this.map.set(this.getKey(item), item);
   }
 
   has(item: T) {
     return this.map.has(this.getKey(item));
   }
 
   delete(item: T) {
     return this.map.delete(this.getKey(item));
   }
 
   get size() {
     return this.map.size;
   }
   
   get length() {
      return this.size;
   }

   get items() {
     return Array.from(this.map.values());
   }

   forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
     this.items.forEach(callbackfn, thisArg);
   }

   len() { return this.size }
   get(n: number) { return Array.from(this.map.values())[n] }
}