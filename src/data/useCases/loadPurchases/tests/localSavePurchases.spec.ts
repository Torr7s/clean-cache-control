import { CacheStoreSpy, mockPurchases } from '@/data/tests';
import { LocalLoadPurchases } from '@/data/useCases';

import { SavePurchases } from '@/domain/useCases';

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

describe('LocalSavePurchases', (): void => {
  /* SUT = System Under Test */
  it('should not delete or insert cache during SUT.init', (): void => {
    const factory: SUTTypes = makeSUTFactory();

    expect(factory.cacheStore.activities).toEqual([]);
  });

  it('should not insert new cache if delete fails', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    factory.cacheStore.$simulateDeleteError();

    const sutPromise: Promise<void> = factory.sut.save(mockPurchases());

    expect(factory.cacheStore.activities).toEqual([CacheStoreSpy.Activity.DELETE]);
    await expect(sutPromise).rejects.toThrow();
  });

  it('should insert new cache if delete succeeds', async (): Promise<void> => {
    const timestamp = new Date();

    const factory: SUTTypes = makeSUTFactory(timestamp);
    const purchases: SavePurchases.Params[] = mockPurchases();

    const sutPromise: Promise<void> = factory.sut.save(purchases);

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.DELETE,
      CacheStoreSpy.Activity.INSERT,
    ]);

    expect(factory.cacheStore.deleteKey).toBe('purchases');
    expect(factory.cacheStore.insertKey).toBe('purchases');

    expect(factory.cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    });

    await expect(sutPromise).resolves.toBeFalsy();
  });

  it('should throw if insert throws', async (): Promise<void> => {
    const factory: SUTTypes = makeSUTFactory();

    /**
     * If deletion fails, insertCallsCount should not be called
     */
    factory.cacheStore.$simulateInsertError();

    /**
     * Must be called without an async keyword, because as soon as the delete method from CacheStoreSpy class 
     * throws an exception, the production class (LocalLoadPurchases) will fall in an exception flow (try-catch)
     * and won't execute the rest of the code.
     * 
     * In other words, it has to be treated as a Promise to allow the execution of the following code.
     */
    const sutPromise: Promise<void> = factory.sut.save(mockPurchases());

    expect(factory.cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.DELETE,
      CacheStoreSpy.Activity.INSERT,
    ]);
    /**
     * It will prevent taht the CacheStoreSpy class won't treat the throwned Error internally with a try-catch, 
     * ensuring that this error is only passed on.
    */
    await expect(sutPromise).rejects.toThrow();
  });
});
