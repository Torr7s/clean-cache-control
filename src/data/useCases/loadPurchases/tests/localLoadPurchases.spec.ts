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

  it('should return an empty list if load fails', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    factory.cacheStore.$simulateFetchError();

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);

    expect(purchases).toEqual([]);
  });

  it('should return a list of purchases if cache is valid', async (): Promise<void> => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    
    expect(purchases).toEqual(factory.cacheStore.fetchResult.value);
  });

  it('should return an empty list if cache is expired', async (): Promise<void> => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    
    expect(purchases).toEqual([]);
  });

  it('should return an empty list if cache is on expiration date', async (): Promise<void> => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }

    const purchases: PurchaseModel[] = await factory.sut.loadAll();
    
    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    
    expect(purchases).toEqual([]);
  });

  it('should return an empty list if cache is empty', async (): Promise<void> => {
    const currentDate: Date = new Date();
    const timestamp: Date = getCacheExpirationDate(currentDate);

    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const factory: SUTTypes = makeSUTFactory(currentDate);

    factory.cacheStore.fetchResult = {
      timestamp,
      value: []
    }

    const purchases: PurchaseModel[] = await factory.sut.loadAll();

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.FETCH]);
    expect(factory.cacheStore.fetchKey).toBe('purchases');
    
    expect(purchases).toEqual([]);
  });
});
