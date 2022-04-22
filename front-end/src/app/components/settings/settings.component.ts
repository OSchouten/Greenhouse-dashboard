import {Component, Inject, Input, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings/settings.service";
import {DOCUMENT} from '@angular/common';
import {Temperature} from "../../models/units";
//import translate from "deepl";

//import translate from "deepl";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private class = 'dark';
  private storage = 'darkMode';


  @Input()
  get value(): boolean {
    return this.document.body.classList.contains(this.class);
  }

  set value(isDark: boolean) {
    localStorage.setItem(this.storage, isDark.toString());

    if (isDark) {
      this.document.body.classList.add(this.class);
    } else {
      this.document.body.classList.remove(this.class);
    }
  }


  constructor(public settingsService: SettingsService, @Inject(DOCUMENT) private document: Document) {
  }


  selectedDay: string = '';

  changeLang(event: any) {
    this.selectedDay = event.target.value;
    localStorage.setItem('selectedLanguage', this.selectedDay);

    let text: string[] = document.body.innerText.split(" ");
    const translate = require("deepl");
    let taal = localStorage.getItem('selectedLanguage');

    for (let i = 0; i < text.length; i++) {

      translate({
        free_api: true,
        text: text[i],
        source_lang: "EN",
        target_lang: taal,
        auth_key: '2cf649cf-595e-55b9-85a6-152670373f30:fx',
        // All optional parameters available in the official documentation can be defined here as well.
      })
        .then(result => {
          // console.log("VERTAALD: " + result.data.translations[0].text);
          // console.log(document.body.innerText.length)

          document.body.innerHTML = document.body.innerHTML.replace(text[i], result.data.translations[0].text);

//document.body.replaceWith(text[i], result.data.translations[0].text);
        })
        .catch(error => {
          console.error(error)
        });
    }
  }

  ngOnInit(): void {

  }

  clickCelsius() {
    this.settingsService.clickCelsius();
    location.reload();
  }

  setFahrenheit() {
    let settings = this.settingsService.settings;
    settings.temperatureUnit = Temperature.F;
    this.settingsService.settings = settings;
  }

  setCelsius() {
    let settings = this.settingsService.settings;
    settings.temperatureUnit = Temperature.C;
    this.settingsService.settings = settings;
  }

  refresh(): void {
    window.location.reload();
  }

}
