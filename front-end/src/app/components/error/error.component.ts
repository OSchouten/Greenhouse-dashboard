import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public path: string;

  constructor() {
    this.path = window.location.pathname;
  }

  ngOnInit(): void {
  }

}
