import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Book } from '../../../model/Book';
import { HttpClientService } from '../../../service/http-client.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit {

  @Input() book: Book;
  @Output() bookAddedEvent = new EventEmitter();

  private selectedFile: File | null = null;
  imgURL: any;
  existingImageURL: any;
  bookForm: FormGroup;
  userName: string = null;
  isLoggedIn: boolean = false;
  admin: boolean = false
  feedback: FeedBack = { feedbackType: '', feedbackmsg: '' };

  constructor(
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.book) {
      // Popola il modulo con i valori dell'oggetto book se esiste
      this.existingImageURL = this.book.picByte ? 'data:image/jpeg;base64,' + this.book.picByte : '';
      this.bookForm = this.fb.group({
        name: [this.book.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        author: [this.book.author || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        price: [this.book.price || '', [Validators.pattern('^[0-9]+(\\.[0-9]{2})?$')]]
      });
    } else {
      // Inizializza un modulo vuoto se book non esiste
      this.bookForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{2})?$')]]

      });
    }
  }

  public onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imgURL = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveBook() {
    // Aggiorna l'oggetto book con i valori del modulo
    if (this.book) {
      this.book.name = this.bookForm.get('name').value;
      this.book.author = this.bookForm.get('author').value;
      this.book.price = this.bookForm.get('price').value;
    }

    if (this.book.id == null) {
      this.uploadAndSaveBook();
    } else {
      this.updateBook();
    }
  }

  private uploadAndSaveBook() {
    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('imageFile', this.selectedFile, this.selectedFile.name);

      this.httpClient.post('http://localhost:8080/books/upload', uploadData, { observe: 'response' })
        .subscribe((response) => {
          if (response.status === 200) {
            this.httpClientService.addBook(this.book).subscribe(
              () => {
                this.bookAddedEvent.emit();
                this.router.navigate(['admin', 'books']);
              }
            );
          } else {
            console.log('Image not uploaded successfully');
          }
        });
    } else {
      console.log('No image selected.');
    }
  }

  private updateBook() {
    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('imageFile', this.selectedFile, this.selectedFile.name);

      this.httpClient.post('http://localhost:8080/books/upload', uploadData, { observe: 'response' })
        .subscribe((response) => {
          if (response.status === 200) {
            this.updateBookDetails();
          } else {
            console.log('Image not uploaded successfully');
          }
        });
    } else {
      this.updateBookDetails();
    }
  }

  private updateBookDetails() {
    this.httpClientService.updateBook(this.book).subscribe(
      () => {
        this.bookAddedEvent.emit();
        this.router.navigate(['admin', 'books']);
      }
    );
  }
}
