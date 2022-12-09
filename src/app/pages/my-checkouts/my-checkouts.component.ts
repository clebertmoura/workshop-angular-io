import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { concatMap, filter, finalize, map, tap, toArray } from 'rxjs/operators';
import { IOrderItem } from 'src/app/models/order-item.model';
import { IOrder, OrderStatus } from 'src/app/models/order.model';
import { OrderItemService } from 'src/app/services/order-item.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-checkouts',
  templateUrl: './my-checkouts.component.html',
  styleUrls: ['./my-checkouts.component.scss']
})
export class MyCheckoutsComponent implements OnInit {

  orders?: IOrder[] = [];
  ordersCollapseMap: any = {};
  loading = false;
  cancelledSubject = new Subject<boolean>();
  cancelledObs$!: Observable<boolean>;

  constructor(
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // descomente esse linha para usar o cancelamento de subscrição
    // this.cancelledObs$ = this.cancelledSubject.pipe(shareReplay());

    this.loading = true;
    this.orderService
      .query()
      .pipe(
        // descomente esse linha para usar o cancelamento de subscrição
        // takeUntil(this.cancelledObs$),

        concatMap(resOrders => resOrders ?? []),

        // o operador take só recebe apenas as 3 primeiras emissões e depois completa.
        // take(3),
        filter(order => order.status === OrderStatus.COMPLETED),
        concatMap(order => this.loadOrderItems(order)),

        // use o mergeMap para requisições em paralelo
        // mergeMap(order => this.loadOrderItems(order)),

        tap(order => this.orders?.push(order)),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  loadOrderItems(order: IOrder): Observable<IOrder> {
    this.ordersCollapseMap[order.id] = { collapsed: true };
    return this.orderItemService.queryByOrder(order.id).pipe(
      // descomente esse linha para usar o cancelamento de subscrição
      // takeUntil(this.cancelledObs$),

      concatMap(resOrderItems => (order.items = resOrderItems ?? [])),
      concatMap(orderItem => this.loadOrderItemProduct(orderItem)),

      // use o mergeMap para requisições em paralelo
      // mergeMap(orderItem => this.loadOrderItemProduct(orderItem)),

      map(() => order)
    );
  }

  loadOrderItemProduct(orderItem: IOrderItem): Observable<IOrderItem> {
    return this.productService.find(orderItem.product!.id).pipe(
      // descomente esse linha para usar o cancelamento de subscrição
      // takeUntil(this.cancelledObs$),

      tap(product => (orderItem.product = product ?? orderItem.product)),
      map(() => orderItem)
    );
  }

  cancel(): void {
    this.cancelledSubject.next(true);
  }

}
