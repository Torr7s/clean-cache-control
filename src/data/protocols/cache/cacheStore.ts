export interface CacheStore {
  delete: (key: string) => void;
  fetch: (key: string) => void;
  /**
   * As CacheStore is a generic component, that can be used by any use case,
   * the 2nd parameter cannot receive a fixed type
   */
  insert: (key: string, value: any) => void;
  replace: (key: string, value: any) => void;
}
