import { CacheStore } from '@/data/protocols/cache';
import { LoadPurchases, SavePurchases } from '@/domain/useCases';

export class LocalLoadPurchases implements LoadPurchases, SavePurchases {
  private readonly key: string;

  constructor(
    private readonly cacheStore: CacheStore, 
    private readonly currentDate: Date
  ) {
    this.key = 'purchases';
  }

  public async loadAll(): Promise<Array<LoadPurchases.Model>> {
    try {
      const cache: any = this.cacheStore.fetch(this.key);
      const CACHE_MAX_AGE = new Date(cache.timestamp);

      CACHE_MAX_AGE.setDate(CACHE_MAX_AGE.getDate() + 3);

      if (CACHE_MAX_AGE > this.currentDate) {
        return cache.value;
      } else {
        // Avoiding code repetition, which would be the same as what is inside the catch
        throw new Error();
      }
    } catch (error) {
      this.cacheStore.delete(this.key);

      return []; 
    }
  }

  public async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    /**
     * Since the flow of cache insertion is always "delete old data -> insert new data", 
     * it is worth creating a method like replace 
     */
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases
    });
  }
}