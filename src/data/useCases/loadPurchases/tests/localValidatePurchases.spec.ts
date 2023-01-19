import { CacheStoreSpy, getCacheExpirationDate, mockPurchases } from '@/data/tests';
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

  it('should has no side effect if load succeeds', (): void => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp
    }

    factory.sut.validate();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
  });

  it('should delete cache if its expired', (): void => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    timestamp.setSeconds(timestamp.getSeconds() - 1);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp
    }

    factory.sut.validate();

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.FETCH,
      CacheStoreSpy.Activity.DELETE
    ]);
    
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    expect(factory.cacheStore.deleteKey).toBe('purchases');
  });

  it('should delete cache if its on expiration date', (): void => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp
    }

    factory.sut.validate();
    
    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.FETCH,
      CacheStoreSpy.Activity.DELETE
    ]);

    expect(factory.cacheStore.deleteKey).toBe('purchases');
    expect(factory.cacheStore.fetchKey).toBe('purchases');
  });
});
