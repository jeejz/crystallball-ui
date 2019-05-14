import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { CrystallBallService } from '../services/rest.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentication.service';
//import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginComponent {

  error: boolean = false;
  passwordMismatch: boolean = false;
  showDiv: boolean = false;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alert: AlertService
  ) {

  }
  submitted = false;

  login(Mobile: string, password: string) {
    if (!Mobile || !password) {
      this.error = true;
      return;
    }

    this.error = false;
    let user = new User();
    user.Mobile = Mobile;
    user.Password = password;
    this.submitted = true;
    
    this.authenticationService.login(user).subscribe(data => {
      if (data && data.FirstName) {
        console.log("from service>>" + data.FirstName)
        console.log("from service>>" + data.TotalPoints)
       // this.crystallBallService.setuserData(data);
        this.alert.success('Login Success',true);
        this.router.navigate(['/dashBoard'])
        
      } else {
        this.alert.error('No user found, please register to login',true);
      }

    }
    );
  }


  openDiv(divToShow: string) {
    this.error = false;
    this.passwordMismatch = false;
    if (divToShow == 'login') {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
  }

}
