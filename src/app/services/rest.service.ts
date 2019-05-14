import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../model/user';
import { Prediction } from '../model/prediction';
import { Match } from '../model/match';


const endpoint = 'http://10.240.160.26:8080/crystallball';
const pyendpoint = 'http://127.0.0.1:5000/'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  })
};
@Injectable({ providedIn: 'root' })
export class CrystallBallService {
  private userData: User;

  setuserData(val: User) {
    this.userData = val;
  }

  getuserData() {
    return this.userData;
  }

  constructor(private http: HttpClient) { }

  getUserData(userIn): Observable<User> {
    let user: any;
    console.log("in get user " + JSON.stringify(userIn))
    console.log("in get user ==" + userIn)
    return this.http.post<User>(endpoint + '/authenticateUser', userIn, httpOptions).pipe(
      tap(_ => console.log(`updated Json>` + user)),
      catchError(this.handleError<any>('authenticateUser'))
    );
  }

  saveUserDetails(exJson): Observable<User> {
    let user: any;
    console.log("in get saveUserDetails " + JSON.stringify(exJson))
    return this.http.post<User>(endpoint + '/registerUser', JSON.stringify(exJson), httpOptions).pipe(
      tap(_ => console.log(`updated Json>` + user)),
      catchError(this.handleError<any>('registerUser'))
    );
  }
  savePrediction(exJson): Observable<Prediction> {
    let prediction: any;
    console.log("from service " + JSON.stringify(exJson));
    return this.http.post<Prediction>(endpoint + '/savePrediction', JSON.stringify(exJson), httpOptions).pipe(
      tap(_ => console.log(`updated Json>` + prediction)),
      catchError(this.handleError<any>('registerUser'))
    );

  }

  getPredictableMatches(noofdays): Observable<any> {
    
    console.log("from service " + JSON.stringify(noofdays))
    let pyurl = pyendpoint + '/predictableMatch/' + noofdays;
    return this.http.get<any>(`${endpoint}/predictableMatches/${noofdays}`,httpOptions).pipe(
      tap(_ => console.log(`found matches for "${noofdays}" no of days from today`)),
      catchError(this.handleError<Match[]>('getPredictableMatches', []))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //  console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
