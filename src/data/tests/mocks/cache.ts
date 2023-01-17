import { CacheStore } from '../../protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements CacheStore {
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

  public $simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce((): never => {
      throw new Error();
    });
  }

  public $simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce((): never => {
      throw new Error();
    });
  }
}