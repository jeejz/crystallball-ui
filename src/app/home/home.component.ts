import { Component } from '@angular/core';
import { CrystallBallService } from '../services/rest.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Role } from '../model/role.enum';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  currentUser: User;
  currentUserSubscription: Subscription;
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
