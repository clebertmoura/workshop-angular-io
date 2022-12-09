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
export class MyCheckoutsComponent implements OnInit {
  orders$?: Observable<IOrder[]>;
  ordersCollapseMap: any = {};
  loading = false;
  cancelledSubject = new Subject<boolean>();
  cancelledObs$!: Observable<boolean>;
  errorMessage?: string;

  constructor(private orderService: OrderService, private orderItemService: OrderItemService, private productService: ProductService) {}

  ngOnInit(): void {
    this.cancelledObs$ = this.cancelledSubject.pipe(shareReplay());
    this.loading = true;

    // check: orderService.query() raises an error in first request
    this.orders$ = this.orderService.query().pipe(
      takeUntil(this.cancelledObs$),
      shareReplay(),
      concatMap(resOrders => resOrders ?? []),
      filter(order => order.status === OrderStatus.COMPLETED),
      toArray(),

      // descomente o retry para que tente novamente quando ocorrer um erro
      // retry(1),

      // descomente o catchError para fazer um tratamento de erro, adicionando uma mensagem de erro
      // catchError((error) => {
      //   this.errorMessage = error;
      //   return [];
      // }),
      finalize(() => (this.loading = false))
    );
  }

  cancel(): void {
    this.cancelledSubject.next(true);
  }
}
