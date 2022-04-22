import {Component, OnInit} from '@angular/core';
import {AccountsService} from "../../services/accounts/accounts.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  id: null;
  firstName: null;
  lastName: null;
  email: null;
  password: null;
  password2: null;
  token: null;
  specialty: userSpecialty;
  error: Boolean;
  user: User;

  constructor(public AccountsService: AccountsService, public AccountsRestAdaptorService: AccountsRestAdaptorService, private router: Router) {
    // @ts-ignore
    this.user = new User();
  }

  ngOnInit(): void {

  }

  async register(): Promise<void> {
    // Check if the input fields are empty.
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.password2 || !this.token || !this.user.specialty) {
      this.error = true;
      return;
    }

    let register = await this.AccountsService.getToken(this.token);

    if (register == true) {

      await this.AccountsService.postUser(this.user);

      this.router.navigateByUrl('/login');
    } else {
      alert("Credentials invalid.");
    }
  }

}

enum userSpecialty {
  agronomy = "Agronomy",
  botany = "Botany",
  geology = "Geology",
  hydrology = "Hydrology",
  climateScience = "Climate Science",
  administrator = "Administrator"
}
