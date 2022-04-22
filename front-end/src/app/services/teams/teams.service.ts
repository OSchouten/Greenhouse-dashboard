import {Injectable} from '@angular/core';
import {Team} from "../../models/team";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AccountsService} from "../accounts/accounts.service";


@Injectable({
  providedIn: 'root'
})

export class TeamsService {
  private _teams: Team[] = [];
  private resourceUrl: string;

  constructor(private accountsService: AccountsService, private http: HttpClient) {
    this.resourceUrl = `${environment.BACKEND_URL}/team`;
  }

  public async findById(id: number): Promise<Team> {
    let team = this._teams.find(o => o.id === id);
    // Check if we have the team in memory, and if so, whether it's data is complete.
    if (team == undefined) return await this._getTeam(id);
    if (team.users == undefined) return await this._getTeam(id);
    if (team.users.length == 0) return await this._getTeam(id);
    return team;
  }

  public async getAllTeams(): Promise<Team[]> {
    let teams = await this.http.get<Team[]>(`${this.resourceUrl}/all`).toPromise();

    // Retrieving all teams will fill the teams with minimal data
    // Storing copies of the already known teams will ensure we keep important data.
    let listCopy = [...this._teams];
    this._teams = teams;
    listCopy.forEach(o => this.addTeamLocal(o));
    return this._teams;
  }

  public async deleteTeam(team: number | Team): Promise<boolean> {
    let id;
    if (typeof team === "object") id = team.id;
    else id = team;
    if (await this._deleteTeam(id)) this.removeTeamLocal(id);
    return true;
  }

  /**
   *
   * @param team
   * @return number The ID of the newly added team.
   */
  public async addTeam(team: Team): Promise<number> {
    let addedTeam = await this.http.post<Team>(`${this.resourceUrl}`, team).toPromise();
    this.addTeamLocal(addedTeam);
    return addedTeam.id;
  }

  public async updateTeam(team: Team) {
    let updatedTeam = await this.http.put<Team>(`${this.resourceUrl}/${team.id}`, team).toPromise();
    this.addTeamLocal(updatedTeam);
  }

  private removeTeamLocal(team: Team | number) {
    let id;
    if (typeof team === "object") id = team.id;
    else id = team;
    for (let i = 0; i < this._teams.length; i++) {
      if (this._teams[i].id === id) this._teams.splice(i, 1);
    }
  }

  private addTeamLocal(team: Team): Team {
    for (let i = 0; i < this._teams.length; i++) {
      if (this._teams[i].id === team.id) this._teams.splice(i, 1);
    }
    this._teams.push(team);
    return team;
  }

  private async _deleteTeam(id: number): Promise<boolean> {
    try {
      let deletedTeam = await this.http.delete<Team>(`${this.resourceUrl}/${id}`).toPromise();
    } catch (e) {
      return false;
    }
    return true;
  }

  private async _getTeam(id: number): Promise<Team> {
    let team = await this.http.get<Team>(`${this.resourceUrl}/${id}`).toPromise();
    this.addTeamLocal(team);
    return team;
  }

  get teams(): Team[] {
    return this._teams;
  }
}
