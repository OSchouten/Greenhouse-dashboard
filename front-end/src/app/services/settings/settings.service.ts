import {Injectable} from '@angular/core';
import {Settings} from "../../models/settings";
import {Temperature} from "../../models/units";


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settings: Settings;

  public set settings(settings: Settings) {
    this._settings = settings;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public get settings(): Settings {
    return this._settings;
  }

  constructor() {
    let settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) this._settings = Object.assign(new Settings({}), settings);
    else this.settings = new Settings({});
  }

  clickCelsius(): void {
    this._settings.temperatureUnit = Temperature.C;
    this.settings = this._settings;
  }

  clickFahrenheit(): void {
    this._settings.temperatureUnit = Temperature.F;
    this.settings = this._settings;
  }
}
