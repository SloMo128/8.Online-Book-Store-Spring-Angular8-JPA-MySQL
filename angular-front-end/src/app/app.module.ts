import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GlobalHttpInterceptorService } from './service/global.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { UsersComponent } from './admin/users/users.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdduserComponent } from './admin/users/adduser/adduser.component';
import { ViewuserComponent } from './admin/users/viewuser/viewuser.component';
import { BooksComponent } from './admin/books/books.component';
import { AddbookComponent } from './admin/books/addbook/addbook.component';
import { ViewbookComponent } from './admin/books/viewbook/viewbook.component';
import { ShopbookComponent } from './page/shopbook/shopbook.component';
import { HttpClientService } from './service/http-client.service';
import { CartListComponent } from './page/cart/cart.list.component';
import { PageNotFoundComponent } from './page.not.found.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoginComponent } from './page/login/login.component';
import { DiscountComponent } from './page/discount/discount.component';
import { OrdersComponent } from './page/orders/orders.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UsersComponent,
    AdduserComponent,
    ViewuserComponent,
    BooksComponent,
    AddbookComponent,
    ViewbookComponent,
    ShopbookComponent,
    CartListComponent,
    PageNotFoundComponent,
    LoginComponent,
    DiscountComponent,
    OrdersComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [ HttpClientService,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
