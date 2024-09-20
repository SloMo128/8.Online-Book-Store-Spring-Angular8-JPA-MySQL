import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../../service/http-client.service';
import { Book } from '../../model/Book';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { FeedBack } from '../../model/FeedBack';

@Component({
  selector: 'app-shopbook',
  templateUrl: './shopbook.component.html',
  styleUrls: ['./shopbook.component.css']
})
export class ShopbookComponent implements OnInit {

  books: Array<Book> = [];
  quantityForms: { [key: number]: FormGroup } = {}; // Form groups for each book
  searchForm: FormGroup;
  cartBooks: Array<any> = [];
  feedback: FeedBack = { feedbackType: '', feedbackmsg: '' };

  totalItems: number = 0;
  pagination: number = 0;
  bookPage: number = 3;
  sortField: string = "name";
  order: string = "DESC";
  searchKeyword: string = '';
  discountPrice: number = 0;

  isLoadingPage: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private httpClientService: HttpClientService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Initialize cartBooks from localStorage if available
    const cartData = localStorage.getItem('cart');
    this.cartBooks = cartData ? JSON.parse(cartData) : [];

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.loadBooks();
  }

  loadBooks() {
    let params = new HttpParams()
      .set('page', String(this.pagination))
      .set('size', String(this.bookPage))
      .set('sort', this.sortField)
      .set('order', this.order);
  
    this.httpClientService.getBooks(params).subscribe({
      next: (data: any) => {
        this.isLoadingPage = true;
        this.isLoading = false

        if (data.books && data.books.length > 0) {
          this.books = data.books.map(book => {
              const priceValue = parseFloat(book.price);
              const discountValue = parseFloat(book.discount);

              // Calculate the final price
              const finalPrice = discountValue > 0 
                  ? priceValue - (priceValue * discountValue / 100) 
                  : priceValue;

              return {
                  ...book,
                  retrievedImage: 'data:image/jpeg;base64,' + book.picByte,
                  finalPrice: finalPrice.toFixed(2) // Ensure the final price is formatted correctly
              };
          });
        }
        this.totalItems = data.totalItems;
  
        // Initialize a form for each book
        this.books.forEach(book => {
          this.quantityForms[book.id] = this.fb.group({
            quantity: [0, [Validators.required, Validators.min(1)]]
          });
        });
      },
      error: (err: any) => {
        this.feedback = { feedbackType: 'error', feedbackmsg: err.feedbackmsg };
        this.isLoadingPage = false;
        this.isLoading = false
      }
    });
  }

  renderPage(event: number) {
    this.pagination = event - 1;
    this.loadBooks();
  }

  toggleSortOrder() {
    this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    this.loadBooks();
  }

  setOrderOption(option: string) {
    this.sortField = option;
    this.loadBooks();
  }

  onSearch() {
    this.searchKeyword = this.searchForm.get('search').value;
    this.pagination = 0;
    this.totalItems = 0;
    this.books = [];
  
    this.httpClientService.getSearchBooks(this.searchKeyword).subscribe({
      next: (data: any) => {
        this.isLoadingPage = true
        this.isLoading = false;
        if (data.length > 0) {
          this.books = data.map(book => ({
            ...book,
            retrievedImage: 'data:image/jpeg;base64,' + book.picByte
          }));
        } else {
          this.feedback = {
            feedbackType: 'info',
            feedbackmsg: `No Books or Authors found matching "${this.searchKeyword}".`
          };
        }
      },
      error: (err: any) => {
        console.error('Search error:', err);
        //this.isLoadingPage = false;
        //this.isLoading = false;
        
        //this.feedback = { feedbackType: 'error', feedbackmsg: err.feedbackmsg };
      }
    });
  }

  get totalPrice(): number {
    return this.cartBooks.reduce((total, book) => {
      const discount = book.discount || 0; // Default to 0 if no discount
      return total + (book.price * book.quantity * (1 - discount));
    }, 0);
  }

  addToCart(bookId: number) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    const quantity = this.quantityForms[bookId].get('quantity').value;
    const existingBookIndex = this.cartBooks.findIndex((item: any) => item.id === bookId);

    if (existingBookIndex > -1) {
      this.cartBooks[existingBookIndex].quantity += quantity;
    } else {
      this.cartBooks.push({
        id: book.id,
        name: book.name,
        price: book.finalPrice,
        author: book.author,
        retrievedImage: book.retrievedImage,
        quantity: quantity
      });
    }

    book.isAdded = true;
    this.updateLocalStorage();
  }

  goToCart() {
    this.router.navigate(['/cart']);
    this.updateLocalStorage();
  }

  removeBook(book: Book) {
    this.cartBooks = this.cartBooks.filter(cartBook => cartBook.id !== book.id);
    this.updateLocalStorage();

    const bookInStore = this.books.find(b => b.id === book.id);
    if (bookInStore) {
      bookInStore.isAdded = false;
    }
  }

  emptyCart() {
    this.cartBooks = [];
    localStorage.removeItem('cart');
    this.books.forEach(book => book.isAdded = false);
  }

  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  }
}