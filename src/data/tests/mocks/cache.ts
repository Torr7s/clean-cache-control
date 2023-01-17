import { CacheStore } from '../../protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements CacheStore {
  activities: CacheStoreSpy.Activity[];

  deleteKey: string;
  insertKey: string;

  insertValues: Array<SavePurchases.Params>;

  constructor() {
    this.activities = [];
    this.insertValues = [];
  }

  public delete(key: string): void {
    this.activities.push(CacheStoreSpy.Activity.DELETE);
    
    this.deleteKey = key;
  }

  public insert(key: string, value: any): void {
    this.activities.push(CacheStoreSpy.Activity.INSERT);
    
    this.insertKey = key;
    this.insertValues = value;
  };

  public $simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce((): never => {
      this.activities.push(CacheStoreSpy.Activity.DELETE);

      throw new Error();
    });
  }

  public $simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce((): never => {
      this.activities.push(CacheStoreSpy.Activity.INSERT);

      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Activity {
    DELETE = 'delete',
    INSERT = 'insert'
  }
}