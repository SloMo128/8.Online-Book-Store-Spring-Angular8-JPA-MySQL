import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/model/User ';
import { HttpClientService } from 'src/app/service/http-client.service';
import { Router } from '@angular/router';
import { Type } from 'src/app/model/Type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {

  designations: Type[] = [];
  userForm: FormGroup;
  isEditMode: boolean = false;
  passwordVisible: boolean = true;

  @Input() user: User;
  @Output() userDeletedEvent = new EventEmitter();

  constructor(
    private httpClientService: HttpClientService, 
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getUserProfile();
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [this.user ? this.user.name : '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: [this.user ? this.user.password : '', [Validators.required, Validators.minLength(6)]],
      type: [this.user ? this.user.type : '', Validators.required],
    });
  }

  getUserProfile() {
    this.httpClientService.allType().subscribe({
      next: profiles => this.designations = profiles,
      error: err => console.error('Error loading user profiles:', err)
    });
  }

  findUserProfile(designationCode: string): string {
    const designation = this.designations.find(desig => desig.code === designationCode);
    return designation ? designation.name : 'Unknown';
  }

  editUser() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.initForm(); // Reset form values
  }

  updateUser() {
    if (this.userForm.valid) {
      this.httpClientService.updateUser(this.user.id, this.userForm.value).subscribe(
        () => {
          this.isEditMode = false;
          this.userDeletedEvent.emit();
        },
        error => console.error('Error updating user:', error)
      );
    }
  }

  deleteUser() {
    if (confirm('Are you sure you want to delete this user?')) {
      this.httpClientService.deleteUser(this.user.id).subscribe(
        () => {
          this.userDeletedEvent.emit();
          this.router.navigate(['admin', 'users']);
        },
        error => console.error('Error deleting user:', error)
      );
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
