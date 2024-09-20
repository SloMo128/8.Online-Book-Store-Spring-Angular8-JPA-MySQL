import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedBack } from '../../model/FeedBack';
import { Book } from 'src/app/model/Book';
import { HttpClientService } from '../../service/http-client.service';
import { Orders } from 'src/app/model/Orders';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.list.component.html',
})
export class CartListComponent implements OnInit {

  cartBooks: Book[] = [];
  feedback = new FeedBack("", "");
  paymentInProgress: boolean = false;
  isLogin: boolean = false;
  userId: string = null;

  constructor(private router: Router, private httpClientService: HttpClientService) { }

  ngOnInit() {
    // Retrieve cart data from localStorage
    const data = localStorage.getItem('cart');
    if (data !== null) {
      this.cartBooks = JSON.parse(data);
    }
  }

  // Calculate total cart price
  get totalPrice(): number {
    return this.cartBooks.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Remove a book from the cart
  removeFromCart(book: Book) {
    this.cartBooks = this.cartBooks.filter(cartBook => cartBook.id !== book.id);
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  }

  // Empty the entire cart
  emptyCart() {
    this.cartBooks = [];
    localStorage.removeItem('cart');
  }

  login() {
    if (!localStorage.getItem('user')) {
      this.isLogin = false
      this.router.navigate(['/login']);
    }
    else {
      this.isLogin = true;
      const user = JSON.parse(localStorage.getItem('user'));
      this.userId = user.id;
    }
  }

  // Proceed to checkout
  proceedToCheckout() {
    this.login();
    if (this.isLogin) {
      this.httpClientService.createOrder(this.userId).subscribe({
        next: (order: Orders) => {
          const orderId = order.id;
          this.bookUserOrder(orderId);
          this.paymentInProgress = true;
          // Clear localStorage and navigate after 3 seconds
          setTimeout(() => {
            localStorage.removeItem('cart');
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
          this.feedback = {
            feedbackType: "error",
            feedbackmsg: "An error occurred during the checkout process.",
          };
        }
      });
    }

  }

  // Add books to user order
  bookUserOrder(orderId: any) {
    console.log("LOGGATO 2");
    this.cartBooks.forEach((cartItem: Book) => {
      console.log(cartItem.price)
      this.httpClientService.addBookUser(orderId, cartItem.id, cartItem.quantity, cartItem.price).subscribe({
        next: (data: any) => {
          this.feedback = {
            feedbackType: "success",
            feedbackmsg: "Payment successful!",
          };
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
          this.feedback = {
            feedbackType: "error",
            feedbackmsg: "An error occurred during the checkout process.",
          };
        }
      });
    });
  }
}
