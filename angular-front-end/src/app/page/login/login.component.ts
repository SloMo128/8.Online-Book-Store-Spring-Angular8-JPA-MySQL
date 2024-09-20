import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/service/http-client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  feedback: { feedbackType: string; feedbackmsg: string } = { feedbackType: '', feedbackmsg: '' };
  passwordVisible: boolean = false;
  isLoadingPage: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private httpClientService: HttpClientService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login(): void {
    this.httpClientService.login(this.userForm.value).subscribe({
      next: (response) => {
        this.feedback = {
          feedbackType: 'success',
          feedbackmsg: 'Welcome: ' + response.name
        };
        localStorage.setItem('user', JSON.stringify(response));
        setTimeout(() => {
          this.router.navigate(['/'])
          .then(() => {
              window.location.reload();
          });
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false; // Stop loading indicator
        this.feedback = {
          feedbackType: 'error',
          feedbackmsg: error.feedbackType === 'error_login' 
            ? 'Login failed. Please check your credentials.' 
            : error.feedbackmsg || 'An unexpected error occurred.'
        };
      }
    });
  }
}
