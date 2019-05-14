import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/model/match';
import { User } from 'src/app/model/user';
import { Subscription } from 'rxjs';
import { CrystallBallService } from 'src/app/services/rest.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-match-prediction',
  templateUrl: './match-prediction.component.html',
  styleUrls: ['./match-prediction.component.css']
})
export class MatchPredictionComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  private predictableMatches: Match[] = [];

  constructor(
    private restService: CrystallBallService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
  }

  ngOnInit(): void {
    
    this.getPredictableMatches();
    
  }

  getPredictableMatches(noofdays = 30): void {
    this.restService.getPredictableMatches(noofdays).
      subscribe((matches: any) => {
        console.log(matches);
        this.predictableMatches = matches;
      });
    console.log(this.predictableMatches);

  }

}
