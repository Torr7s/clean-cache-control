import { CacheStoreSpy, mockPurchases } from '@/data/tests';
import { LocalLoadPurchases } from '@/data/useCases';
import { PurchaseModel } from '@/domain/models';

type SUTTypes = {
  cacheStore: CacheStoreSpy;
  sut: LocalLoadPurchases;
}

const makeSUTFactory = (timestamp: Date = new Date()): SUTTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return {
    cacheStore,
    sut
  }
}

describe('LocalLoadPurchases', (): void => {
  it('should not delete or insert cache during SUT.init', (): void => {
    const factory: SUTTypes = makeSUTFactory();

    expect(factory.cacheStore.activities).toEqual([]);
  });

  it('should return an empty list if load fails', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    factory.cacheStore.$simulateFetchError();

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.FETCH, 
      CacheStoreSpy.Activity.DELETE
    ]);
    expect(factory.cacheStore.deleteKey).toBe('purchases');

    expect(purchases).toEqual([]);
  });
  
  it('should return a list of purchases if cache is less than 3 days old', async (): Promise<void> => {
    const timestamp: Date = new Date();
    const factory: SUTTypes = makeSUTFactory(timestamp);

    factory.cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    
    expect(purchases).toEqual(factory.cacheStore.fetchResult.value);
  });
});
