import { CacheStore } from '../../protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements CacheStore {
  activities: CacheStoreSpy.Activity[];

  deleteKey: string;
  fetchKey: string;
  insertKey: string;

  fetchResult: any;
  insertValues: Array<SavePurchases.Params>;

  constructor() {
    this.activities = [];
    this.fetchResult = [];
    this.insertValues = [];
  }

  public delete(key: string): void {
    this.activities.push(CacheStoreSpy.Activity.DELETE);
    this.deleteKey = key;
  }

  public fetch(key: string): any {
    this.activities.push(CacheStoreSpy.Activity.FETCH);
    this.fetchKey = key;

    return this.fetchResult;
  }

  public insert(key: string, value: any): void {
    this.activities.push(CacheStoreSpy.Activity.INSERT);
    
    this.insertKey = key;
    this.insertValues = value;
  };

  public replace(key: string, value: any): void {
    this.delete(key);
    this.insert(key, value);
  };

  public $simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce((): never => {
      this.activities.push(CacheStoreSpy.Activity.DELETE);

      throw new Error();
    });
  }

  public $simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce((): never => {
      this.activities.push(CacheStoreSpy.Activity.FETCH);

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
    FETCH = 'fetch',
    INSERT = 'insert'
  }
}