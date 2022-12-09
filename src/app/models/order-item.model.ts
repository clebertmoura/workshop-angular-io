import { IOrder } from "src/app/models/order.model";
import { IProduct } from "src/app/models/product.model";

export interface IOrderItem {
  id: number;
  quantity?: number | null;
  totalPrice?: number | null;
  product?: IProduct | null;
  order?: IOrder | null;
}
