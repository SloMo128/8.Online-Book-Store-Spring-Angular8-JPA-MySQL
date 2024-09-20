import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/model/Book';
import { HttpClientService } from 'src/app/service/http-client.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
})
export class DiscountComponent implements OnInit {

  books: Array<Book> = [];
  action: string;
  selectedBook: Book;
  feedback = { feedbackType: '', feedbackmsg: '' };
  isLoadingPage: boolean = true;
  priceDiscount: number = 0;
  isEditing: boolean = false;

  constructor(
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.isLoadingPage = true;
    this.httpClientService.getAllBooks().subscribe({
      next: (response) => this.handleSuccessfulResponse(response),
      error: (error) => {
        this.feedback = {
          feedbackType: 'error',
          feedbackmsg: error.feedbackmsg || 'An error occurred while fetching books.'
        };
        this.isLoadingPage = false;
      },
      complete: () => {
        this.isLoadingPage = false;
        this.handleQueryParams();
      }
    });
  }

  handleSuccessfulResponse(response: Array<Book>): void {
    this.books = response.map(book => {
      const bookWithImage = new Book();
      bookWithImage.id = book.id;
      bookWithImage.name = book.name;
      bookWithImage.retrievedImage = 'data:image/jpeg;base64,' + book.picByte;
      bookWithImage.author = book.author;
      bookWithImage.price = book.price;
      bookWithImage.discount = book.discount;
      bookWithImage.startDate = book.startDate;
      bookWithImage.endDate = book.endDate;
      return bookWithImage;
    });
  }

  handleQueryParams(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.action = params['action'];
      const id = params['id'];
      if (id) {
        this.selectedBook = this.books.find(book => book.id === +id);
        if (this.action === 'view' && this.selectedBook) {
          this.router.navigate(['discount'], { queryParams: { id, action: 'view' } });
        }
      }
    });
  }

  getDiscountedPrice(book: Book): number {
    if (book.discount) {
      return book.price - (book.price * (+book.discount / 100));
    }
    return book.price;
  }

  editBook(): void {
    this.isEditing = true;
  }

  saveBook(): void {
    // Convert dates to the proper format (yyyy-MM-dd) if needed
    const startDate = this.selectedBook.startDate ? new Date(this.selectedBook.startDate).toISOString().split('T')[0] : '';
    const endDate = this.selectedBook.endDate ? new Date(this.selectedBook.endDate).toISOString().split('T')[0] : '';

    const currentDate = new Date();
    const selectedEndDate = new Date(this.selectedBook.endDate);
    const selectedStartDate = new Date(this.selectedBook.startDate);

    if (currentDate < selectedStartDate || currentDate > selectedEndDate) {
      this.feedback = {
        feedbackType: 'error',
        feedbackmsg: 'The current date must be between the start date and end date to apply a discount.'
      };
      return;
    }

    // If the endDiscount date is in the past, set the discount to 0
  if (selectedEndDate < currentDate) {
    this.selectedBook.discount = "0";
    this.feedback = {
      feedbackType: 'info',
      feedbackmsg: 'Discount period has ended. Discount set to 0.'
    };
  }

    this.httpClientService.discountBook(this.selectedBook.id, +this.selectedBook.discount, startDate, endDate).subscribe({
      next: (response) => {
        this.feedback = {
          feedbackType: 'success',
          feedbackmsg: 'Book details updated successfully.'
        };
        this.isEditing = false;
        this.refreshData(); // Refresh data to show updated details
      },
      error: (error) => {
        this.feedback = {
          feedbackType: 'error',
          feedbackmsg: error.feedbackmsg || 'An error occurred while updating the book.'
        };
      }
    });
  }

  viewBook(id: number): void {
    this.router.navigate(['discount'], { queryParams: { id, action: 'view' } });
  }
}
