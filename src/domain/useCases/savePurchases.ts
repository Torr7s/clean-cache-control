import { PurchaseModel } from '@/domain/models';

export namespace SavePurchases {
  export type Params = PurchaseModel
}

export interface SavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => Promise<void>;
}