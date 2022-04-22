import {Temperature} from "./units";

export class Settings {
  private _temperatureUnit: Temperature = Temperature.C;

  constructor(config: { temperatureUnit?: Temperature }) {
    this._temperatureUnit = config.temperatureUnit;
  };

  get isCelsius(): boolean {
    return this._temperatureUnit === Temperature.C;
  }

  get isFahrenheit(): boolean {
    return this._temperatureUnit === Temperature.F;
  }

  set temperatureUnit(unit: Temperature) {
    this._temperatureUnit = unit;
  }
}
