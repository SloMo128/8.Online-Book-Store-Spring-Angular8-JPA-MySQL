import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/service/http-client.service';
import { Orders } from 'src/app/model/Orders';
import { Book } from 'src/app/model/Book';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: Orders[] = [];
  newOrderName: string = '';
  orderIdsString: string = ''; // Changed from number to string
  updatedOrderName: string = '';
  booksId: number = 0;
  displayedBooks: number = 0;

  constructor(private orderService: HttpClientService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.orderService.getOrdersByName(user.id).subscribe(
        (orders: Orders[]) => {
          this.orders = orders;
          this.orderIdsString = orders.map(order => order.id).join(', '); // Join IDs as a string
          console.log(this.orderIdsString);

          // Fetch books for each order ID
          orders.forEach(order => {
            this.orderService.getOrderBooksByOrderId(order.id).subscribe(
              (books) => {
                console.log(books);
                order.books = books;

                this.booksId = books.map(book => book.bookId).join(', ');
                console.log(this.booksId);
                //this.displayBooks(this.booksId);
              },
              (error) => {
                console.error('Error loading orders:', error);
              }
            );
            this.orderService.getBookById(this.booksId).subscribe(
              (book: any) => {
                console.log('Fetched Book to Display:', book);
           
                this.displayedBooks = book;
              },
              (error) => {
                console.error('Error fetching book for display:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error loading orders:', error);
        }
      );
    } else {
      console.error('User information not found in local storage.');
    }
  }

  /*displayBooks(bookId: number): void {
    this.orderService.getBookById(bookId).subscribe(
      (book: any) => {
        console.log('Fetched Book to Display:', book);
   
        this.displayedBooks = book;
      },
      (error) => {
        console.error('Error fetching book for display:', error);
      }
    );
  }*/
  
}
