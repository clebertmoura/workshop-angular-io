import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCheckoutsComponent } from 'src/app/pages/my-checkouts/my-checkouts.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-checkouts' , pathMatch: 'full'},
  { path: 'my-checkouts', component: MyCheckoutsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
