import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IOrderItem } from 'src/app/models/order-item.model';
import { IOrder } from 'src/app/models/order.model';
import { OrderItemService } from 'src/app/services/order-item.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-checkouts',
  templateUrl: './my-checkouts.component.html',
  styleUrls: ['./my-checkouts.component.scss']
})
export class MyCheckoutsComponent implements OnInit {

  public orders?: IOrder[];

  public ordersCollapseMap: any = {};

  constructor(
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.orderService
      .query()
      .pipe(
        map(resOrders => (this.orders = resOrders ?? [])),
        tap(orders => {
          orders.forEach(order => {
            this.loadOrderItems(order);
          });
        })
      )
      .subscribe(orders => {
        this.orders = orders;
      });
  }

  loadOrderItems(order: IOrder): Subscription {
    this.ordersCollapseMap[order.id] = { collapsed: true };
    return this.orderItemService
      .queryByOrder(order.id)
      .pipe(
        map(resOrderItems => (order.items = resOrderItems ?? [])),
        tap(orderItems => {
          orderItems.forEach(orderItem => {
            this.loadOrderItemProduct(orderItem);
          });
        })
      )
      .subscribe();
  }

  loadOrderItemProduct(orderItem: IOrderItem): Subscription {
    return this.productService
      .find(orderItem.product!.id)
      .pipe(
        tap(product => (orderItem.product = product ?? orderItem.product))
      )
      .subscribe();
  }

}
