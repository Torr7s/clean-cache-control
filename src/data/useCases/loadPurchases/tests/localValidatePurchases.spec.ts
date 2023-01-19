import { CacheStoreSpy } from '@/data/tests';
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

  it('should delete cache if load fails', (): void => {
    const factory: SUTTypes = makeSUTFactory();

    factory.cacheStore.$simulateFetchError();
    factory.sut.validate();

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.FETCH,
      CacheStoreSpy.Activity.DELETE
    ]);
    expect(factory.cacheStore.deleteKey).toBe('purchases');
  });
});
