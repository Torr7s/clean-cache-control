import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class LocalSavePurchases implements SavePurchases {
  constructor(
    private readonly cacheStore: CacheStore, 
    private readonly timestamp: Date
  ) {}

  public async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    /**
     * Since the flow of cache insertion is always "delete old data -> insert new data", 
     * it is worth creating a method like replace 
     */
    this.cacheStore.replace('purchases', {
      timestamp: this.timestamp,
      value: purchases
    });
  }
}