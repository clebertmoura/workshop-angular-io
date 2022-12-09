import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { concatMap, map, tap, toArray } from 'rxjs/operators';
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
        concatMap(resOrders => (this.orders = resOrders ?? [])),
        tap(order => {
          this.ordersCollapseMap[order.id] = { collapsed: true }
        }),
        // com o concatMap as requisições ao backend são realizadas de forma sequencial, e emitidas uma a uma
        concatMap(order => this.loadOrderItems(order)),

        // com o mergeMap as requisições ao backend são realizadas de forma paralela
        // mergeMap(order => this.loadOrderItems(order)),

        // o switchMap cancela a subscrições de requisições anteriores que não tenham sido completadas
        // switchMap(order => this.loadOrderItems(order)),

        // converte as emissões em um array
        toArray()
      )
      .subscribe();
  }

  loadOrderItems(order: IOrder): Observable<IOrderItem[]> {
    return this.orderItemService.queryByOrder(order.id).pipe(
      concatMap(resOrderItems => (order.items = resOrderItems ?? [])),
      concatMap(orderItem => this.loadOrderItemProduct(orderItem)),
      // mergeMap(orderItem => this.loadOrderItemProduct(orderItem)),
      // switchMap(orderItem => this.loadOrderItemProduct(orderItem)),
      toArray()
    );
  }

  loadOrderItemProduct(orderItem: IOrderItem): Observable<IOrderItem> {
    return this.productService.find(orderItem.product!.id).pipe(
      tap(product => (orderItem.product = product ?? orderItem.product)),
      map(() => orderItem)
    );
  }

}
