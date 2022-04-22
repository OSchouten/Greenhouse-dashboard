import {Injectable} from '@angular/core';
import {AccountsService} from "../accounts/accounts.service";
import {Router} from "@angular/router";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthSbHttpInterceptorService implements HttpInterceptor {

  constructor(private AccountsService: AccountsService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('authentication/login' || '/registerUser')) {
      return next.handle(req);
    }

    let token = this.AccountsService.getTokenFromBrowserStorage();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `${JSON.parse(token).token}`
        }
      });

      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {

          },
          (error: HttpErrorResponse) => {
            if (error.status == 401) {
              // Authorization error, route to sign-out.
              this.router.navigate(["../", "login"]);
            } else if (error.status != 406) {
              // Navigate to an error page and provide useful error info
              let errorMessage = `Request-url = ${error.url}`
                + `<br>Response status code = ${error.status}`
                + `<br>Error message = ${error.message}`
              this.router.navigate(["../", "login"], {state: {message: errorMessage}})
            }
          }
        )
      );
    } else {
      this.router.navigate(["../", "login"]);
      return next.handle(req);
    }
  }
}
