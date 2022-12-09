import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { combineAll, concatAll, concatMap, delay, every, filter, map, tap, toArray } from "rxjs/operators";
import { IOrderItem } from "src/app/models/order-item.model";
import { OrderService } from 'src/app/services/order.service';

@Injectable({ providedIn: 'root' })
export class OrderItemService {

  protected apiUrl = 'assets/db/data.json';

  private cacheOrderItems?: IOrderItem[];

  constructor(
    private httpClient: HttpClient,
    private orderService: OrderService) {}

  find(id: number): Observable<IOrderItem> {
    let obs: Observable<IOrderItem[]>;
    if (this.cacheOrderItems) {
      obs = of(this.cacheOrderItems);
    } else {
      obs = this.query();
    }
    return obs.pipe(
      concatMap(orderItems => orderItems),
      filter(orderItem => orderItem.id == id)
    );
  }

  query(): Observable<IOrderItem[]> {
    if (this.cacheOrderItems) {
      return of(this.cacheOrderItems);
    } else {
      return this.httpClient.get<any>(this.apiUrl)
        .pipe(
          map(data => data.orderItems),
          tap(orderItems => this.cacheOrderItems = orderItems)
        );
    }
  }

  queryByOrder(orderId: number): Observable<IOrderItem[]> {
    return this.query().pipe(
      delay(1000),
      concatMap(items => items),
      filter(orderItem => orderItem.order!.id === orderId),
      tap(item => console.log(item)),
      toArray(),
    );
  }

}
