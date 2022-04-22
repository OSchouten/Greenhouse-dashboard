import {Component, OnInit} from '@angular/core';
import {AccountsService} from "../../services/accounts/accounts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: String = null;
  public password: String = null;
  public error: boolean = false;
  public credentialsInvalid: boolean = false;

  constructor(public AccountsService: AccountsService, public router: Router) {
  }

  ngOnInit(): void {
    if (this.AccountsService.getLoggedIn == true) {
      this.router.navigate(["/dashboard"]);
    }
  }

  async login(): Promise<void> {
    // Check if the input fields are empty and email is valid.
    if (!this.email || !this.password || !this.AccountsService.validateEmail(this.email)) {
      this.error = true;
      return;
    }

    let login = await this.AccountsService.login(this.email, this.password);

    // Validate input fields and log in.
    if (login != null) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.credentialsInvalid = true;
    }
  }
}
