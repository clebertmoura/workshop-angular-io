import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { concatMap, delay, filter, map, tap } from "rxjs/operators";
import { IOrder } from "src/app/models/order.model";

@Injectable({ providedIn: 'root' })
export class OrderService {

  protected apiUrl = 'assets/db/data.json';

  protected cacheOrders?: IOrder[];

  protected attempt = 1;

  constructor(private httpClient: HttpClient) {}

  create(order: IOrder): Observable<IOrder> {
    order.id = this.cacheOrders?.length ?? 1;
    this.cacheOrders?.push(order);
    return of(order);
  }

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
          delay(1000),
          tap(() => {
            if (this.attempt === 1) {
              this.attempt++;
              throw 'Error loading data from API';
            }
          }),
          map(data => data.orders),
          tap(orders => this.cacheOrders = orders)
        );
    }
  }

}
