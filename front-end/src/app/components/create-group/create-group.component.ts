import {Component, OnInit} from '@angular/core';
import {TeamsService} from "../../services/teams/teams.service";
import {Team} from "../../models/team";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";
import {AccountsService} from "../../services/accounts/accounts.service";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  public team: Team;
  public isNotValid: boolean = false;

  constructor(private teamsService: TeamsService, private accountsService: AccountsService, private accountsRestService: AccountsRestAdaptorService) {
  }

  ngOnInit(): void {
    this.team = new Team(0);
  }

  public validateName(name: string): boolean {
    return (!name.replace(/\s/g, '').length);
  }

  public async createGroup(): Promise<void> {
    if (this.validateName(this.team.teamName)) {
      this.isNotValid = true;
      return;
    }

    let teamId = await this.teamsService.addTeam(this.team);
    let teamResponse = await this.teamsService.findById(teamId);
    let team = new Team(teamResponse);
    let userId = this.accountsService.user.id;
    let user = await this.accountsRestService.asyncFindById(userId);
    user.teamId = team.id;
    await this.accountsRestService.asyncSave(user);
    window.location.href = "/groups";
  }

}
