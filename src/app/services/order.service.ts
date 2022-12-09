import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { concatMap, filter, map, tap } from "rxjs/operators";
import { IOrder } from "src/app/models/order.model";

@Injectable({ providedIn: 'root' })
export class OrderService {

  protected apiUrl = 'assets/db/data.json';

  protected cacheOrders?: IOrder[];

  constructor(private httpClient: HttpClient) {}

  find(id: number): Observable<IOrder> {
    let obs: Observable<IOrder[]>;
    if (this.cacheOrders) {
      obs = of(this.cacheOrders);
    } else {
      obs = this.query();
    }
    return obs.pipe(
      concatMap(orders => orders),
      filter(order => order.id == id)
    );
  }

  query(): Observable<IOrder[]> {
    if (this.cacheOrders) {
      return of(this.cacheOrders);
    } else {
      return this.httpClient.get<any>(this.apiUrl)
        .pipe(
          map(data => data.orders),
          tap(orders => this.cacheOrders = orders)
        );
    }
  }

}
