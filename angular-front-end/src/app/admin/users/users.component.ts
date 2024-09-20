import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User '; 
import { HttpClientService } from 'src/app/service/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from 'src/app/model/Type';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  isLoggedIn: boolean = false;
  admin: boolean = false
  feedback: FeedBack = { feedbackType: '', feedbackmsg: '' };

  users: Array<User> = [];
  action: string;
  selectedUser: User | undefined;
  designations: Type[] = [];

  constructor(
    private httpClientService: HttpClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    //this.checkAdminStatus();
    //if (this.admin) {
      this.refreshData();
      this.getUserPofile();
    //}
  }

  checkAdminStatus(): void {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    this.admin = user && user.type === 'ADM';

    if (!this.admin) {
      this.feedback = {
        feedbackType: 'error',
        feedbackmsg: 'You are not authorized. Redirecting to home...'
      };
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }

  refreshData() {
    console.log('Refreshing data...');
    this.httpClientService.getUsers().subscribe(
      response => this.handleSuccessfulResponse(response),
      error => console.error('Error fetching users:', error)
    );

    this.activatedRoute.queryParams.subscribe(params => {
      this.action = params['action'];
      const selectedUserId = params['id'];
      if (selectedUserId) {
        this.selectedUser = this.users.find(user => user.id === +selectedUserId);
      }
    });
  }

  getUserPofile() {
    this.httpClientService.allType().subscribe({
      next: profiles => this.designations = profiles,
      error: err => console.error('Error loading employee profiles:', err)
    });
  }

  findUserProfile(designationCode: string): string {
    const designation = this.designations.find(desig => desig.code === designationCode);
    return designation ? designation.name : 'Unknown';
  }

  viewUser(id: number) {
    this.router.navigate(['admin', 'users'], { queryParams: { id, action: 'view' } });
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], { queryParams: { action: 'add' } });
  }

  handleSuccessfulResponse(response: User[]) {
    this.users = response;
  }
}
