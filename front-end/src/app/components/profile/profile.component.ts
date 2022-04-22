import {Component, OnInit} from '@angular/core';
import {AccountsService} from "../../services/accounts/accounts.service";
import {Specialty, User} from "../../models/user";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public email: String;
  public firstName: String;
  public lastName: String;
  public specialty: String;

  public newPassword: String = "";
  public confirmPassword: String = "";
  public error: boolean = false;

  constructor(public AccountsService: AccountsService, public AccountsRestAdaptorService: AccountsRestAdaptorService) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.AccountsRestAdaptorService.asyncFindById(JSON.parse(this.AccountsService.getTokenFromBrowserStorage()).user.id);

    if (this.user != null) {
      this.email = this.user.email;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName
      this.specialty = this.user.specialty;
    }
  }

  // Creates a copy of a User.
  getCopy(form: String): User {
    // Make a copy.
    let copy = User.copyConstructor(<User>this.user);

    if (form == "AccountDetails") {
      // Assign the values to the copy.
      return <User>this.getValuesAccountDetails(copy);
    } else if (form == "ChangePassword") {
      // Assign the values to the copy.
      return <User>this.getValuesChangingPassword(copy);
    }

    return null;
  }

  // Save changed user details.
  saveUserDetails(): void {
    if (!this.email || !this.firstName || !this.lastName || !this.AccountsService.validateEmail(this.email)) {
      this.error = true;
      return;
    }

    this.AccountsRestAdaptorService.asyncSave(this.getCopy("AccountDetails")).then(r => {
      alert("Changes are saved.");
    });
  }

  // Save changed password.
  savePassword(): void {
    if (!this.confirmPassword || !this.newPassword || !this.AccountsService.validatePassword(this.newPassword)) {
      this.error = true;
      return;
    }

    if (this.newPassword != this.confirmPassword) {
      alert("Your new password and confirmation password do not match.");
      return;
    }

    this.AccountsRestAdaptorService.asyncSavePassword(this.getCopy("ChangePassword")).then(r => {
      alert("New password is saved.");
    });
  }

  // Get the values from the form.
  public getValuesAccountDetails(user: User) {
    // @ts-ignore
    user.firstName = document.getElementById('firstName').value;

    // @ts-ignore
    user.lastName = document.getElementById('lastName').value;

    // @ts-ignore
    user.email = document.getElementById('email').value;

    // @ts-ignore
    user.specialty = document.getElementById('specialty').value;

    if (JSON.parse(this.AccountsService.getTokenFromBrowserStorage()).user.specialty == "Admin") {
      user.specialty = Specialty.administrator;
    }

    return user;
  }

  // Get the values from the form.
  public getValuesChangingPassword(user: User) {
    // @ts-ignore
    user.password = document.getElementById('newPassword').value;

    return user;
  }

}
