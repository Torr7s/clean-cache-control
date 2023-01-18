import { PurchaseModel } from '@/domain/models';

export namespace LoadPurchases {
  export type Model = PurchaseModel;
}

export interface LoadPurchases {
  loadAll: () => Promise<Array<LoadPurchases.Model>>;
}