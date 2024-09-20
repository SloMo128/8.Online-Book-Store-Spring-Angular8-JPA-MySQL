import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './admin/users/users.component';
import { BooksComponent } from './admin/books/books.component';
import { ShopbookComponent } from './page/shopbook/shopbook.component';
import { CartListComponent } from './page/cart/cart.list.component';
import { PageNotFoundComponent } from './page.not.found.component';
import { LoginComponent } from './page/login/login.component';
import { BookGuard } from './authentication/book.guard';
import { UserGuard } from './authentication/user.guard';
import { DiscountComponent } from './page/discount/discount.component';
import { DiscountGuard } from './authentication/discount.guard';
import { OrdersComponent } from './page/orders/orders.component';



const routes: Routes = [
  { path: 'admin/users', component: UsersComponent , canActivate: [UserGuard]}, 
  { path: 'admin/books', component: BooksComponent , canActivate: [BookGuard]},
  { path: 'discount', component: DiscountComponent, canActivate: [DiscountGuard]},
  { path: 'cart', component: CartListComponent },
  { path: 'shop', component: ShopbookComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
