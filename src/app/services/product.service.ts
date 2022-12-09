import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { concatMap, filter, map, tap } from "rxjs/operators";
import { IProduct } from "src/app/models/product.model";

@Injectable({ providedIn: 'root' })
export class ProductService {

  protected apiUrl = 'assets/db/data.json';

  protected cacheProducts?: IProduct[];

  constructor(private httpClient: HttpClient) {}

  find(id: number): Observable<IProduct> {
    let obs: Observable<IProduct[]>;
    if (this.cacheProducts) {
      obs = of(this.cacheProducts);
    } else {
      obs = this.query();
    }
    return obs.pipe(
      concatMap(Products => Products),
      filter(Product => Product.id == id)
    );
  }

  query(): Observable<IProduct[]> {
    if (this.cacheProducts) {
      return of(this.cacheProducts);
    } else {
      return this.httpClient.get<any>(this.apiUrl)
        .pipe(
          map(data => data.products),
          tap(products => this.cacheProducts = products)
        );
    }
  }

}
