import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import {AccountsRestAdaptorService} from "./accounts-rest-adaptor.service";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private resourcesUrl: string;
  private _user: User;

  constructor(public AccountsRestAdaptorService: AccountsRestAdaptorService, private http: HttpClient) {
    this.resourcesUrl = environment.BACKEND_URL + "/authentication/login";
  }

  get user(): User {
    if (this._user == null) {
      this._user = JSON.parse(this.getTokenFromBrowserStorage()).user;
    }
    return User.copyConstructor(this._user);
  }

  get isAdmin(): boolean {
    if (this.user != null) {
      return this._user.specialty == "Admin";
    }
    return false;
  }

  // Returns whether the user is logged in.
  get getLoggedIn(): boolean {
    return this.getTokenFromBrowserStorage() != "";
  }

  // Login with JWT.
  async login(email, password): Promise<User> {
    let response0 = this.http.post<HttpResponse<User>>(this.resourcesUrl,
      {email: email, password: password},
      {observe: "response"}).pipe(shareReplay(1));

    let response1 = await response0.toPromise().catch(error => {
      console.log(error);
      this.logOut();
      return null;
    });

    let user = (response1?.body as unknown as User);

    if (response1 != null) {
      let token = response1['headers'].get('Authorization');
      if (token != null) {
        this.saveTokenIntoBrowserStorage(token, user);
      }
    }

    return user;
  }

  // For now just fake user and no checks.
  async getToken(token): Promise<boolean> {

    let user = await this.AccountsRestAdaptorService.asyncFindToken(token);

    if (user == null) {
      return false;
    }

    return true;
  }

  // For now just fake user and no checks.
  async postUser(user: User): Promise<boolean> {

    let userTest = await this.AccountsRestAdaptorService.asyncPostUser(user);

    return userTest != null;


  }

  // Clear the session and local storage.
  logOut(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  // Validate email with regex.
  validateEmail(email): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  // Validate password on length.
  validatePassword(password): boolean {
    return password.length > 7;
  }

  // Save the token into the local and session storage.
  saveTokenIntoBrowserStorage(token: string, user: User) {
    let newValue = JSON.stringify({token: token, user: user});
    sessionStorage.setItem(environment.BROWSER_STORAGE_ITEM_NAME, newValue);


    localStorage.setItem(environment.BROWSER_STORAGE_ITEM_NAME, newValue);
  }

  // Get token from the local or session storage.
  getTokenFromBrowserStorage(): string {
    let token = sessionStorage.getItem(environment.BROWSER_STORAGE_ITEM_NAME);

    if (token != null) {
      return token;
    } else if (localStorage.getItem(environment.BROWSER_STORAGE_ITEM_NAME) != null) {
      token = localStorage.getItem(environment.BROWSER_STORAGE_ITEM_NAME);

      if (token != null) {
        sessionStorage.setItem(environment.BROWSER_STORAGE_ITEM_NAME, token);
        return token;
      }
    }

    return "";
  }
}
