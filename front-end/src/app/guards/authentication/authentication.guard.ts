import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountsService} from "../../services/accounts/accounts.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(public AccountsService: AccountsService, public router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.AccountsService.getLoggedIn;

    // Admin dashboard protection.
    if (isLoggedIn && (state.url == "/admin/dashboard") && (JSON.parse(this.AccountsService.getTokenFromBrowserStorage()).user.specialty != "Admin")) {
      return this.router.createUrlTree(['/dashboard']);
    }

    if (isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }

}
