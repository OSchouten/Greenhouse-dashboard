import {Component, Inject, Input} from '@angular/core';
import {DOCUMENT} from "@angular/common";

//import translate from "deepl";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';

  private class = 'dark';
  private storage = 'darkMode';

  @Input()
  get value(): boolean {
    return this.document.body.classList.contains(this.class);

  }

  constructor(@Inject(DOCUMENT) private document: Document) {
  }


  set value(isDark: boolean) {
    localStorage.setItem('darkmode', isDark.toString());

    if (isDark) {
      this.document.body.classList.add(this.class);
    } else {
      this.document.body.classList.remove(this.class);
    }
  }

  ngOnInit(): void {
    const value = localStorage.getItem('darkMode');
    if (value) {
      this.value = JSON.parse(value);
    }

  }
}
