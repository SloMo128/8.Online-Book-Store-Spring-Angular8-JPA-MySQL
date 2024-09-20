import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../model/User ';
import { Book } from '../model/Book';
import { Type } from '../model/Type';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';
import { Orders } from '../model/Orders';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient:HttpClient
  ) { }

  //USER

  getUsers()
  {
    console.log("test call");
    return this.httpClient.get<User[]>('http://localhost:8080/users/get');
  }

  addUser(newUser: User) {
    return this.httpClient.post<User>('http://localhost:8080/users/add', newUser);   
  }

  deleteUser(id) {
    return this.httpClient.delete<User>('http://localhost:8080/users/' + id);
  }

  allType(): Observable<Type[]> {
    return this.httpClient.get<Type[]>('http://localhost:8080/type/');
  }

  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.httpClient.put<User>(`http://localhost:8080/users/update/${id}`, updatedUser);
  }

  login(login: Login): Observable<Login>{
    return this.httpClient.post<Login>(`http://localhost:8080/users/login`, login, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  //BOOK

  getSearchBooks(search)
  {
    return this.httpClient.get<any>(`http://localhost:8080/books/search?keyword=${search}`);
  }

  getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`http://localhost:8080/books/get/${id}`);
  }

  discountBook(id: number, discount: number, startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams()
      .set('discount', discount.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.httpClient.put(`http://localhost:8080/books/update/${id}`, {},{ params });
  }

  getBooks(params: any) {
    return this.httpClient.get<Book[]>('http://localhost:8080/books/get', {params});
  }

  getAllBooks(){
    return this.httpClient.get<Book[]>('http://localhost:8080/books/getAll');
  }

  addBook(newBook: any) {
    return this.httpClient.post<Book>('http://localhost:8080/books/add', newBook);
  }

  deleteBook(id) {
    return this.httpClient.delete<Book>('http://localhost:8080/books/' + id);
  }

  updateBook(updatedBook: Book) {
    return this.httpClient.put<Book>('http://localhost:8080/books/update', updatedBook);
  }

  //ORDINI

  addBookUser(orderId: number, bookId: number, quantity: number, price: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    let params = new HttpParams()
      .set('orderId', orderId.toString())
      .set('bookId', bookId.toString())
      .set('quantity', quantity.toString())
      .set('price', price.toString());
  
    return this.httpClient.post<any>(`http://localhost:8080/user-books/add`, {}, { headers, params });
  }

  // Create a new order
  createOrder(name: string): Observable<Orders> {
    const headers = { 'content-type': 'application/json' };
    let params = new HttpParams().set('name', name);

    return this.httpClient.post<Orders>(`http://localhost:8080/orders/addOrder`, {}, { headers, params });
  }

  getOrderBooksByOrderId(orderId: number)
  {
    return this.httpClient.get<any>('http://localhost:8080/user-books/order/' + orderId);
  }

  // Get orders by name
  getOrdersByName(name: string): Observable<Orders[]> {
    return this.httpClient.get<Orders[]>(`http://localhost:8080/orders/` + name);
  }

}
