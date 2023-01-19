import { CachePolicy, CacheStore } from '@/data/protocols/cache';
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
      const cacheIsValid: boolean = CachePolicy.validate(cache.timestamp, this.currentDate); 

      const throwError = (): never => {
        throw new Error();
      }

      return cacheIsValid ? cache.value : throwError();
    } catch (error) {
      this.cacheStore.delete(this.key);

      return []; 
    }
  }

  public async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases
    });
  }
}