import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  private resourceUrl: string;

  constructor(private http: HttpClient) {
    this.resourceUrl = `${environment.BACKEND_URL}`;
  }

  public async _addToken(email: string): Promise<boolean> {
    let response = await this.http.post<String>(`${this.resourceUrl}/token`, email).toPromise();
    return response != null;
  }

  public async _addTeam(teamName: string, id: number): Promise<boolean> {
    let response = await this.http.post<Object>(`${this.resourceUrl}/team`, {id: id, teamName: teamName}).toPromise();

    return response != null;

  }

  public async _deleteToken(token: string): Promise<boolean> {
    try {
      let deleteToken = await this.http.delete<String>(`${this.resourceUrl}/${token}`).toPromise();
    } catch (e) {
      return false;
    }
    return true;
  }

  validateEmail(email): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }
}
