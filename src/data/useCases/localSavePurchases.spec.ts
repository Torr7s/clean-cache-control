class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  public async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

interface CacheStore {
  delete: () => void;
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
    const cacheStore = new CacheStoreSpy();
    
    new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it('should delete old cache on SUT.save', async (): Promise<void> => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});