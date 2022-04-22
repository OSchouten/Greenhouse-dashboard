import {Component, OnInit} from '@angular/core';
import {AccountsService} from "../../services/accounts/accounts.service";
import {Specialty} from "../../models/user";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isAdmin: Boolean = false;

  constructor(public accountsService: AccountsService) {
    if (this.accountsService.getLoggedIn) {
      if (this.accountsService.user.specialty == Specialty.administrator) {
        this.isAdmin == true;
      }
    }

  }

  ngOnInit(): void {
  }


}
