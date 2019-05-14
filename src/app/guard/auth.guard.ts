import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, CanActivateChild, Route, UrlSegment, RouteConfigLoadEnd } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../model/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  canLoad(route: Route, segments: UrlSegment[]) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.role === Role.Admin) {
      return true;
    }
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.role === Role.Admin) {
      return true;
    }
    return false;
  }



  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    //, { queryParams: { returnUrl: state.url } });
    return false;
  }

}
