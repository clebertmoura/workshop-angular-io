import { ICustomer } from "src/app/models/customer.model";
import { IOrderItem } from "src/app/models/order-item.model";

export enum OrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export interface IOrder {
  id: number;
  placedDate?: Date | null;
  status?: OrderStatus | null;
  code?: string | null;
  customer?: ICustomer | null;
  items?: IOrderItem[] | null;
}
