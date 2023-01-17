import { LocalSavePurchases } from '@/data/useCases';
import { CacheStore } from '@/data/protocols/cache';

import { SavePurchases } from '@/domain';

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

/**
 * Mocked version of the CacheStore interface
 */
class CacheStoreSpy implements CacheStore {
  deleteKey: string;
  insertKey: string;
  deleteCallsCount: number = 0;
  insertCallsCount: number = 0;

  insertValues: Array<SavePurchases.Params>;

  constructor() {
    this.insertValues = [];
  }

  public delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  public insert(key: string, value: any): void {
    this.insertCallsCount++;
    this.insertKey = key;

    this.insertValues = value;
  };
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: 'random_id_1',
    date: new Date(),
    value: 199
  },
  {
    id: 'random_id_2',
    date: new Date(),
    value: 199
  },
  {
    id: 'random_id_3',
    date: new Date(),
    value: 199
  },{
    id: 'random_id_4',
    date: new Date(),
    value: 199
  }
];

describe('LocalSavePurchases', (): void => {
  /* SUT = System Under Test */
  it('should not delete cache during SUT.init', (): void => {
    const { cacheStore } = makeSUTFactory();

    new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it('should delete old cache on SUT.save', async (): Promise<void> => {
    const { cacheStore, sut } = makeSUTFactory();

    await sut.save(mockPurchases());

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  it('should insert new cache if delete succeeds', async (): Promise<void> => {
    const { cacheStore, sut } = makeSUTFactory();
    const purchases: SavePurchases.Params[] = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);

    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it('should not insert new cache if delete fails', (): void => {
    const { cacheStore, sut } = makeSUTFactory();

    /**
     * If deletion fails, insertCallsCount should not be called
     */
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce((): never => {
      throw new Error();
    });

    /**
     * Must be called without an async keyword, because as soon as the delete method from CacheStoreSpy class 
     * throws an exception, the production class (LocalSavePurchases) will fall in an exception flow (try-catch)
     * and won't execute the rest of the code.
     * 
     * In other words, it has to be treated as a Promise to allow the execution of the following code.
     */
    const sutPromise: Promise<void> = sut.save(mockPurchases());

    /**
     * It will prevent taht the CacheStoreSpy class won't treat the throwned Error internally with a try-catch, 
     * ensuring that this error is only passed on.
    */
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(sutPromise).rejects.toThrow();
  });
});
