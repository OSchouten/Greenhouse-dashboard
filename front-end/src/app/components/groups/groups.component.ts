import {Component, Inject, OnInit} from '@angular/core';
import {TeamsService} from "../../services/teams/teams.service";
import {Team} from "../../models/team";
import {DOCUMENT} from "@angular/common";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";
import {AccountsService} from "../../services/accounts/accounts.service";
import {faPencilAlt, faSave} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  public currentTeam: Team;
  public faPencilAlt = faPencilAlt;
  public faSave = faSave;
  public groupName: string;
  private _updatingGroupName: boolean = false;
  public isNotValid: boolean = false;

  constructor(
    private teamService: TeamsService,
    @Inject(DOCUMENT) private document: Document,
    private accountServiceRest: AccountsRestAdaptorService,
    public accountService: AccountsService
  ) {
  }

  addStyleSheet() {
    if (JSON.parse(localStorage.getItem('darkMode')) == true) {
      const headID = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');
      link.type = 'text/css';
      // link.rel = 'stylesheet';
      link.id = 'widget_styles';
      headID.appendChild(link);

      link.href = './groupsDark.component.scss';
      this.document.getElementById('widget_styles').setAttribute('href', 'styles.scss');

    } else {
      const headID = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');
      link.type = 'text/css';
      // link.rel = 'stylesheet';
      link.id = 'widget_styles';
      headID.appendChild(link);

      link.href = './groups.component.scss';
      this.document.getElementById('widget_styles').setAttribute('href', 'groups.component.scss');

    }
  }

  public set updatingGroupName(i: boolean) {
    this._updatingGroupName = i;
    this.groupName = this.currentTeam.teamName;
  }

  public get updatingGroupName() {
    return this._updatingGroupName;
  }

  sendMail(emailAddress: string) {
    window.location.assign("mailto:" + emailAddress);
  }

  public validateName(name: string): boolean {
    return (!name.replace(/\s/g, '').length);
  }

  public async updateGroupName(): Promise<void> {
    if (this.validateName(this.groupName)) {
      this.isNotValid = true;
      return;
    }
    this.currentTeam.teamName = this.groupName;
    await this.teamService.updateTeam(this.currentTeam);
    window.location.reload();
  }

  ngOnInit(): void {
    this.addStyleSheet();
    let id = this.accountService.user.id;
    this.accountServiceRest.getUserTeamByUserId(id).then(team => {
      if (team == null) {
        this.currentTeam = undefined;
        return;
      }
      this.teamService.findById(team.id).then(fetchedTeam => {
        this.currentTeam = fetchedTeam;
      });
    });
  }
}
