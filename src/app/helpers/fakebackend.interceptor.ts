import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { User } from '../model/user';
import { UsersData } from '../tmpdata/userdata.json';
import { Teams, Matches } from '../tmpdata/teammatchdata.json';
import { MatchPredictionsQuestions, JackpotQuestions } from '../tmpdata/predictionsqns.json';
import { JackPotPredictionsUserData, MatchPredcitionsUserData } from '../tmpdata/predictionresults.json';
import { Injectable } from '@angular/core';
import { Team } from '../model/team';
import { Match } from '../model/match';

let users = UsersData || JSON.parse(localStorage.getItem('local_users')) || [];
let teamslist = Teams || [];
let matcheslist = Matches || [];
let MatchPredictionsQuestionsList = MatchPredictionsQuestions || [];
let JackpotQuestionsList = JackpotQuestions || [];
let JackPotPredictionsUserDataList = JackPotPredictionsUserData || [];
let MatchPredcitionsUserDataList = MatchPredcitionsUserData || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    users: User[];
    team: Team;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());


        function handleRoute() {
            switch (true) {
                case url.endsWith('/registerUser') && method === 'POST':
                    return register();
                case url.endsWith('/authenticateUser') && method === 'POST':
                    return authenticate();
                case url.match('/predictableMatches/[0-9]*$') && method === 'GET':
                    return getPredictableMatches();
                case url.endsWith('/teams') && method === 'GET':
                    //IMplement if required
                    return getUserById();
                case url.match('/\/teams\/\d[A-Za-z]]$/') && method === 'POST':
                    return getRequestedTeam(url);
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function register() {
            const user = body

            if (users.find(x => x.Mobile === user.Mobile)) {
                return error('Mobile "' + user.Mobile + '" is already registered')
            }

            users.push(user);
            localStorage.setItem('local_users', JSON.stringify(users));

            return ok();
        }

        function authenticate() {
            const { Mobile, Password } = body;
            const user = users.find(x => x.Mobile === Mobile && x.Password === Password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                FirstName: user.FirstName,
                SecondName: user.SecondName,
                TotalPoints: user.TotalPoints,
                Mobile: user.Mobile,
                role: user.role,
                token: user.token
            })
        }

        function getPredictableMatches() {
            if (!isLoggedIn()) return unauthorized();
            return ok({matcheslist});
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id == idFromUrl());
            return ok(user);
        }

        function getRequestedTeam(url) {
            if (!isLoggedIn()) return unauthorized();

            //load team
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};