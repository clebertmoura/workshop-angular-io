import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { concatMap, filter, finalize, map, shareReplay, takeUntil, tap, toArray } from 'rxjs/operators';
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
export class MyCheckoutsComponent {

  cache$?: Observable<Array<IOrder>>;

  ordersCollapseMap: any = {};
  loading = true;
  reloadOrders$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private productService: ProductService
  ) { }

  get orders$(): Observable<Array<IOrder>> {
    if (!this.cache$) {
      this.cache$ = this.orderService.query().pipe(
        // descomente as linhas abaixo para recarregar que a subscrição seja notificada de forma compartilhada
        // takeUntil(this.reloadOrders$),
        // shareReplay({ bufferSize: 1, refCount: true}),

        concatMap(resOrders => resOrders ?? []),
        filter(order => order.status === OrderStatus.COMPLETED),
        toArray(),
        finalize(() => (this.loading = false))
      );
    }
    return this.cache$;
  }

  addOrder(): void {
    const newOrder: IOrder = {
      id: -1,
      code: 'asdasdsa',
      customer: { id: 1 },
      placedDate: new Date(),
      status: OrderStatus.COMPLETED,
    };
    this.orderService
      .create(newOrder)
      .pipe(
        tap(() => {
          // descomente as linhas abaixo para recarregar a cache
          // this.reloadOrders$.next();
          // this.cache$ = undefined;
        })
      )
      .subscribe();
  }

}
