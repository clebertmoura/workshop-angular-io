import { Component, OnInit } from '@angular/core';
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
    this.orderService.query().subscribe(resOrders => {
      this.orders = resOrders ?? [];
      this.orders.forEach(order => {
        this.ordersCollapseMap[order.id] = { collapsed: true };
        order.items = order.items ?? [];
        this.orderItemService.queryByOrder(order.id).subscribe(resOrderItems => {
          resOrderItems.forEach(orderItem => {
            this.productService.find(orderItem.product!.id).subscribe(resProduct => {
              if (resProduct) {
                orderItem.product = resProduct;
              }
            });
            order.items!.push(orderItem);
          });
        });
      });
    });
  }

}
