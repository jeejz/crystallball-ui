import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { CrystallBallService } from '../services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private crystallBallService : CrystallBallService,
    private router: Router) { }

  ngOnInit() {
  }

  error: boolean = false;
  passwordMismatch: boolean = false;
  submitted = false;

  registerUser(FirstName: string, SecondName: string, Mobile: string, Password: string, Confpassword: string) {
    if (!FirstName || !SecondName || !Mobile || !Password) {
      this.error = true;
      return;
    }
    if (Password != Confpassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;
    this.error = false;
    let user = new User()
    user.FirstName = FirstName;
    user.SecondName= SecondName;
    user.Password= Password;
    user.TotalPoints='15';
    user.Mobile= Mobile;
    
    this.submitted = true;
    console.log("from service>>" + FirstName);
    this.crystallBallService.saveUserDetails(user).subscribe(data => {
      console.log("from service>>" + data)
      if (data && data.FirstName) {
        this.crystallBallService.setuserData(data);
        this.router.navigate(['/dashBoard'])
      }
    }
    );


  }

}
