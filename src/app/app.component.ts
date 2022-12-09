import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'callbackhell-sample';

  constructor(
    private orderService: OrderService
  ) {

  }
}
