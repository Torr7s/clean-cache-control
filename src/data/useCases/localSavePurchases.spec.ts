class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  public async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

interface CacheStore {
  delete: () => void;
}

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
  deleteCallsCount: number = 0;

  public delete(): void {
    this.deleteCallsCount++;
  }
}

describe('LocalSavePurchases', (): void => {
  /* SUT = System Under Test */
  it('should not delete cache during SUT.init', (): void => {
    const { cacheStore } = makeSUTFactory();
    
    new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it('should delete old cache on SUT.save', async (): Promise<void> => {
    const { cacheStore, sut } = makeSUTFactory();

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
