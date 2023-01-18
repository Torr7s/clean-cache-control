import { CacheStoreSpy, mockPurchases } from '@/data/tests';
import { LocalLoadPurchases } from '@/data/useCases';

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

  it ('should call correct key on load', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
  });

  it('should return an empty list if load fails', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    factory.cacheStore.$simulateFetchError();

    const purchases = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.FETCH, 
      CacheStoreSpy.Activity.DELETE
    ]);
    expect(factory.cacheStore.deleteKey).toBe('purchases');

    expect(purchases).toEqual([]);
  });
});
