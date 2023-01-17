import { CacheStoreSpy, mockPurchases } from '@/data/tests';
import { LocalSavePurchases } from '@/data/useCases';

import { SavePurchases } from '@/domain/useCases';

type SUTTypes = {
  cacheStore: CacheStoreSpy;
  sut: LocalSavePurchases;
}

const makeSUTFactory = (): SUTTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return {
    cacheStore,
    sut
  }
}

describe('LocalSavePurchases', (): void => {
  /* SUT = System Under Test */
  it('should not delete or insert cache during SUT.init', (): void => {
    const { cacheStore } = makeSUTFactory();

    expect(cacheStore.activities).toEqual([]);
  });

  it('should delete old cache on SUT.save', async (): Promise<void> => {
    const { cacheStore, sut } = makeSUTFactory();

    await sut.save(mockPurchases());

    expect(cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.DELETE,
      CacheStoreSpy.Activity.INSERT,
    ]);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  it('should not insert new cache if delete fails', (): void => {
    const { cacheStore, sut } = makeSUTFactory();

    cacheStore.$simulateDeleteError();

    const sutPromise: Promise<void> = sut.save(mockPurchases());

    expect(cacheStore.activities).toEqual([CacheStoreSpy.Activity.DELETE]);
    expect(sutPromise).rejects.toThrow();
  });

  it('should insert new cache if delete succeeds', async (): Promise<void> => {
    const { cacheStore, sut } = makeSUTFactory();
    const purchases: SavePurchases.Params[] = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.DELETE,
      CacheStoreSpy.Activity.INSERT,
    ]);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it('should throw if insert throws', (): void => {
    const { cacheStore, sut } = makeSUTFactory();

    /**
     * If deletion fails, insertCallsCount should not be called
     */
    cacheStore.$simulateInsertError();

    /**
     * Must be called without an async keyword, because as soon as the delete method from CacheStoreSpy class 
     * throws an exception, the production class (LocalSavePurchases) will fall in an exception flow (try-catch)
     * and won't execute the rest of the code.
     * 
     * In other words, it has to be treated as a Promise to allow the execution of the following code.
     */
    const sutPromise: Promise<void> = sut.save(mockPurchases());

    expect(cacheStore.activities).toEqual([
      CacheStoreSpy.Activity.DELETE,
      CacheStoreSpy.Activity.INSERT,
    ]);
    /**
     * It will prevent taht the CacheStoreSpy class won't treat the throwned Error internally with a try-catch, 
     * ensuring that this error is only passed on.
    */
    expect(sutPromise).rejects.toThrow();
  });
});
