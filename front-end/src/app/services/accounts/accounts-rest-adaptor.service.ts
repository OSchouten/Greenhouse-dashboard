import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user";
import {shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {Team} from "../../models/team";

@Injectable({
  providedIn: 'root'
})
export class AccountsRestAdaptorService {
  private resourcesUrl: string;
  private resourcesUrlAuthentication: string;
  private resourcesUrlToken: string;

  constructor(private http: HttpClient) {
    this.resourcesUrl = environment.BACKEND_URL + "/users";
    this.resourcesUrlAuthentication = environment.BACKEND_URL + "/authentication";
    this.resourcesUrlToken = environment.BACKEND_URL + "/token";
  }

  async asyncFindAllUsersNoTeam(): Promise<User[]> {
    let response = this.http.get<User[]>(`${environment.BACKEND_URL}/usersNoTeam`);

    const users = await response.toPromise();
    let user: User[] = [];
    for (let i = 0; i < users.length; i++) {
      user.push(User.copyConstructor(users[i]))
    }
    return user;
  }

  async asyncFindToken(token): Promise<User> {
    let response: Observable<User>;

    // Get token.
    response = this.http.get<User>(this.resourcesUrlToken + "/" + token).pipe(shareReplay(1));

    // Error log.
    response.subscribe((user: User) => {
    }, error => console.log(error));

    // Convert json object to User instance.
    const userJson = await response.toPromise();

    if (userJson != null) {
      return User.copyConstructor(userJson);
    } else {
      return null;
    }
  }


  async asyncPostUser(user: User): Promise<User> {
    let response: Observable<User>;

    //post user
    response = this.http.post<User>(environment.BACKEND_URL + "/registerUser", user).pipe(shareReplay(1));

    //error log
    response.subscribe((user: User) => {
    }, error => console.log(error));

    // Convert json object to User instance.
    const userJson = await response.toPromise();

    if (userJson != null) {
      return User.copyConstructor(userJson);
    } else {
      return null;
    }
    // Error log.
  }


  async asyncFindById(id: number): Promise<User> {
    let response: Observable<User>;

    // Get user.
    response = this.http.get<User>(this.resourcesUrl + "/" + id).pipe(shareReplay(1));

    // Error log.
    response.subscribe((user: User) => {
    }, error => console.log(error));

    // Convert json object to User instance.
    const user = await response.toPromise();
    return User.copyConstructor(user);
  }

  async asyncSave(user: User): Promise<User> {
    let response: Observable<User>;

    response = this.http.put<User>(`${this.resourcesUrl}/${user.id}`, user).pipe(shareReplay(1));

    // Error log.
    response.subscribe((user: User) => {
    }, error => console.log(error));

    // Convert json object to User instance.
    const userJson = await response.toPromise();

    return User.copyConstructor(userJson);
  }

  async asyncSavePassword(user: User): Promise<User> {
    let response: Observable<User>;

    response = this.http.put<User>(`${this.resourcesUrl}/updatePassword/${user.id}`, user).pipe(shareReplay(1));

    // Error log.
    response.subscribe((user: User) => {
    }, error => console.log(error));

    // Convert json object to User instance.
    const userJson = await response.toPromise();

    return User.copyConstructor(userJson);
  }

  public async getUserTeamByUserId(id: number): Promise<Team> {
    return await this.http.get<Team>(`${this.resourcesUrl}/${id}/team`).toPromise();
  }
}
