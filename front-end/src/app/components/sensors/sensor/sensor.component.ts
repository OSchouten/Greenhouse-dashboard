import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {SensorsService} from "../../../services/sensors/sensors.service";
import {ReadableUnit} from "../../../models/units";
import {Sensor} from "../../../models/sensor";
import {AccountsService} from "../../../services/accounts/accounts.service";
import {SettingsService} from "../../../services/settings/settings.service";
import {Measures} from "../../../models/measures";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit {
  public sensor: Sensor;
  public unit: string;

  public valueStep: number;
  public displayValue: string;
  public selectedDisplayValue: string;
  public selectedColor: string;
  public isColor: boolean;
  private _selectedValue: number;

  constructor(private sensorService: SensorsService, private userService: AccountsService, private settingsService: SettingsService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  /**
   * @function this method navigates to the sensor notes page
   */
  onSelectSeeNotes() {
    this.router.navigate([`notes/sensor`, this.sensor.identifier], {
      relativeTo: this.activatedRoute
    });
  }

  onSelectAddNote() {
    let string = "new"
    this.router.navigate(['note/sensor/create', this.sensor.identifier, string]);
  }


  public set selectedValue(value: number) {
    this._selectedValue = value;

    if (this.settingsService.settings.isFahrenheit && this.sensor.unit === Measures.TEMPERATURE) {
      this.selectedDisplayValue = (value * 9 / 5 + 32).toFixed(2);
    } else {
      if (this.sensor.unit !== Measures.HEXADECIMAL && this.sensor.unit !== (Measures.ID)) this.selectedDisplayValue = value.toFixed(2);
      else {
        this.displayValue = this.selectedValue.toString();
      }
    }
  }

  public get selectedValue(): number {
    return this._selectedValue;
  }

  @Input() set receivedSensorName(sensorName: string) {
    this.sensor = this.sensorService.getSensorByType(sensorName);
    if (this.sensor.sensorType == "lighting_rgb") this.isColor = true;
    this.valueStep = this.sensor.valueStep;
  };

  @Output() newNoteEvent = new EventEmitter();

  ngOnInit(): void {
    this.updateData();
  }

  async updateData() {
    let data = await this.sensorService.getSensorDataForNameAndTeamId(this.userService.user.id, this.sensor.sensorType, 1);
    if (data == null) return;

    if (this.isColor) {
      this.unit = ReadableUnit[this.sensor.unit];
      this.selectedColor = JSON.parse(data.targets[0].value);
      this.displayValue = this.selectedColor;
      return;
    }

    let currentValue = (+data.values[0].value);

    //Check for conversion of metrics
    if (this.settingsService.settings.isFahrenheit && this.sensor.unit === Measures.TEMPERATURE) currentValue = currentValue * 9 / 5 + 32;

    //Check if unit is a special type to prevent forced decimals on display
    if (this.sensor.unit !== Measures.HEXADECIMAL && this.sensor.unit !== (Measures.ID)) this.displayValue = currentValue.toFixed(2);
    else this.displayValue = currentValue.toString();
    this.selectedValue = +data.targets[0].value;

    if (this.settingsService.settings.isFahrenheit && this.sensor.unit === Measures.TEMPERATURE) {
      this.unit = 'F'
      return;
    }

    this.unit = ReadableUnit[this.sensor.unit];
  }

  //resets the selected value back to the current value
  resetButton() {
    if (this.isColor) {
      this.selectedColor = this.displayValue;
      $("#colorPicker").val(this.selectedColor);

    } else {
      this.selectedValue = +this.displayValue;
    }
  }

  //updates the current value to the selected value
  updateButton() {
    if (this.isColor) {
      this.sensorService.restUpdateSensor(4, this.sensor.sensorType, this.selectedColor, 4,
        this.userService.user.id + "").subscribe(data => {
        this.selectedColor = data[this.sensor.sensorType];
        this.displayValue = this.selectedColor;
      });
    } else if (this.sensor.sensorType == "water_mix_id" || this.sensor.sensorType == "soil_mix_id" || this.sensor.sensorType == "daily_exposure") {
      this.sensorService.restUpdateSensor(4, this.sensor.sensorType, this.selectedValue, 4,
        this.userService.user.id.toString()).subscribe(data => this.selectedValue = JSON.parse(data[this.sensor.sensorType]));
      this.displayValue = this.selectedValue.toString();
    } else {
      this.sensorService.restUpdateSensor(4, this.sensor.sensorType, this.selectedValue, 4,
        this.userService.user.id.toString()).subscribe(data => this.selectedValue = JSON.parse(data[this.sensor.sensorType]));
    }
  }

  showChart(event) {
    const name = event.currentTarget.id;
  }

  updateCurrentSensor(): void {
    this.newNoteEvent.emit(this.sensor);
  }

  colorPickerChange(event) {
    this.selectedColor = event.currentTarget.value;
  }

  public sliderChange(event) {
    this.selectedValue = +event.currentTarget.value;
  }

  onCloseButton(event) {
    this.sensorService.removeSelectedSensor(event.currentTarget.target);
  }
}


