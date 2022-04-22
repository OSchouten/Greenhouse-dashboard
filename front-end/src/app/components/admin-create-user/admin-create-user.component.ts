import {Component, OnChanges, OnInit} from '@angular/core';
import {AdministratorService} from "../../services/administrator/administrator.service";
import {FormControl} from "@angular/forms";
import {Team} from "../../models/team";
import {TeamsService} from "../../services/teams/teams.service";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";
import {User} from "../../models/user";


@Component({
  selector: 'app-admin-create-user',
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.scss']
})
export class AdminCreateUserComponent implements OnInit, OnChanges {
  email: string;
  name = new FormControl('');
  error: Boolean = false;
  public teams: Team[] = [];
  public selectedTeam: Team;
  public selectedUser: User;
  public teamSelect: Team;
  teamName: string;
  teamId: number;
  users: User[] = [];
  addUserSelectedUser: User;

  constructor(private administratorService: AdministratorService, private teamService: TeamsService, private AccountsRestAdaptorService: AccountsRestAdaptorService) {
  }

  ngOnInit(): void {
    this.teamService.getAllTeams().then(fetchedTeams => {
      this.teams = fetchedTeams;
    });

    this.AccountsRestAdaptorService.asyncFindAllUsersNoTeam().then(fetchedTeams => {
      this.users = fetchedTeams;
    });
  }

  ngOnChanges(): void {
    this.teamService.getAllTeams().then(fetchedTeams => {
      this.teams = fetchedTeams;
    });
  }

  get getTeams() {
    return this.teams;
  }

  setSelectedTeam(id: number) {
    this.teamService.findById(id).then(fetchedTeams => {
      this.selectedTeam = fetchedTeams;
    });
  }

  setSelectedUser(id: number) {
    this.AccountsRestAdaptorService.asyncFindById(id).then(fetchedUser => {
      this.selectedUser = fetchedUser;
    });
  }

  saveUser() {
    this.selectedUser.teamId = this.teamSelect.id;

    this.AccountsRestAdaptorService.asyncSave(this.selectedUser).then(r => {
      alert("Changes are saved.");

      // Remove user from old team.
      let pos = this.selectedTeam.users.indexOf(this.selectedUser);
      this.selectedTeam.users.splice(pos, 1);
    });
  }

  removeUser(id: number) {
    this.AccountsRestAdaptorService.asyncFindById(id).then(fetchedUser => {
      this.selectedUser = fetchedUser;

      let pos = this.selectedTeam.users.indexOf(this.selectedUser);
      this.selectedTeam.users.splice(pos, 1);
      this.selectedUser.teamId = -1;


      this.AccountsRestAdaptorService.asyncSave(this.selectedUser).then(r => {
        // Remove user from the array.
        let pos = this.selectedTeam.users.indexOf(this.selectedUser);
        this.selectedTeam.users.splice(pos, 1);

        this.getAllUsersWithNoTeam().then(r => r);
      });
    });

  }

  deleteTeam() {
    this.teamService.deleteTeam(this.selectedTeam).then(d => {
      let pos = this.teams.indexOf(this.selectedTeam);
    });
  }

  addUserToTeam() {
    this.AccountsRestAdaptorService.asyncFindById(this.addUserSelectedUser.id).then(fetchedUser => {
      fetchedUser.teamId = this.selectedTeam.id;
      this.AccountsRestAdaptorService.asyncSave(fetchedUser).then(r => {
        alert("User added to team!");
        this.AccountsRestAdaptorService.asyncFindAllUsersNoTeam().then(fetchedTeams => {
          this.users = fetchedTeams;
        });
      });
    });
  }

  addTeam() {
    this.administratorService._addTeam(this.teamName, this.teamId).then(r => this.teamService.getAllTeams().then(fetchedTeams => {
        this.teams = fetchedTeams;
      })
    );
  }

  async getAllUsersWithNoTeam() {
    this.users = await this.AccountsRestAdaptorService.asyncFindAllUsersNoTeam();
  }

  addToken() {
    if (this.administratorService.validateEmail(this.email)) {
      this.administratorService._addToken(this.email).then(r => console.log(r));
    } else {
      this.error = true;
    }
  }
}
