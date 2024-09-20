import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/model/User '; 
import { HttpClientService } from 'src/app/service/http-client.service';
import { Router } from '@angular/router';
import { Type } from 'src/app/model/Type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  designations: Type[] = [];
  userForm: FormGroup;
  passwordVisible: boolean = false;

  @Input() user: User;
  @Output() userAddedEvent = new EventEmitter();

  constructor(
    private httpClientService: HttpClientService, 
    private router: Router, 
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getType();
    this.form();
  }

  form() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  addUser() {
    if (this.userForm.valid) {
      this.httpClientService.addUser(this.userForm.value).subscribe(
        () => {
          this.userAddedEvent.emit();
          this.router.navigate(['admin', 'users']);
        }
      );
    }
  }

  getType() {
    this.httpClientService.allType().subscribe({
      next: (profiles) => {
        this.designations = profiles;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
}
