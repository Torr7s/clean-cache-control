export interface CacheStore {
  delete: (key: string) => void;
  /**
   * As CacheStore is a generic component, that can be used by any use case,
   * The 2nd param of the insert method cannot receive a fixed type
   */
  insert: (key: string, value: any) => void;
}
