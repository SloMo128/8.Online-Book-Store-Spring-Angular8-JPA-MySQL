import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/model/Book';
import { HttpClientService } from 'src/app/service/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Array<Book> = [];
  booksReceived: Array<Book> = [];
  action: string;
  selectedBook: Book;
  feedback = { feedbackType: '', feedbackmsg: '' };
  admin: boolean = false;
  isLoadingPage: boolean = true;

  constructor(
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    
      this.refreshData();
  }

  refreshData(): void {

    this.httpClientService.getAllBooks().subscribe({
      next: (response) => this.handleSuccessfulResponse(response),
      error: (error) => {
        this.feedback = {
          feedbackType: 'error',
          feedbackmsg: error.feedbackmsg
        };
        this.isLoadingPage = false;
      },
      complete: () => {
        this.isLoadingPage = true;
      }
    });

    this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.action = params['action'];
        const id = params['id'];
        if (id) {
          this.selectedBook = this.books.find(book => book.id === +id);
        }
      }
    );
  }

  handleSuccessfulResponse(response: Array<Book>): void {
    this.books = response.map(book => {
      const bookWithImage = new Book();
      bookWithImage.id = book.id;
      bookWithImage.name = book.name;
      bookWithImage.retrievedImage = 'data:image/jpeg;base64,' + book.picByte;
      bookWithImage.author = book.author;
      bookWithImage.price = book.price;
      return bookWithImage;
    });
  }

  addBook(): void {
    this.selectedBook = new Book();
    this.router.navigate(['admin', 'books'], { queryParams: { action: 'add' } });
  }

  viewBook(id: number): void {
    this.router.navigate(['admin', 'books'], { queryParams: { id, action: 'view' } });
  }
}
