import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SensorsService} from "../../services/sensors/sensors.service";
import {Sensor} from "../../models/sensor";
import {NotesService} from "../../services/notes/notes.service";
import {Note} from "../../models/notes/note";
import {DragulaService} from "ng-dragula";
import {AccountsService} from "../../services/accounts/accounts.service";

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit, OnDestroy {
  @ViewChild('header') headerRef: ElementRef;
  @ViewChild('context') contextRef: ElementRef;

  public sensors: Sensor[];
  locked: boolean = false;
  style: string = "";
  isLocked: string = "fa fa-unlock";
  lockText: string = "Unlocked";
  private idxList: number[];
  private _currentSensor: Sensor;
  public notes: Note[];
  public sensorData: any[] = [];

  @Output() newNoteEvent = new EventEmitter();

  public set currentSensor(sensor: Sensor) {
    this._currentSensor = sensor;
  };

  public get currentSensor(): Sensor {
    return this._currentSensor;
  }

  constructor(private sensorsService: SensorsService, private notesService: NotesService<any>, private dragulaService: DragulaService, private userService: AccountsService) {
  }

  ngOnInit(): void {
    this.sensorsService.loadSensors().then(data => {
      this.sensors = [...this.sensorsService.getSensors()];
      if (this.sensorsService.lockedLocalStorage == "true") {
        this.locked = true;
        this.style = "pointer-events: none"
        this.isLocked = "fa fa-lock";
        this.lockText = "Locked";
      }
    }).then(d => this.sensors = this.checkList(this.sensors, this.sensorsService.idxLocalStorage));

    try {
      this.dragulaService.setOptions('sensorSetting', {
        removeOnSpill: true
      });
    } catch (e) {
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event) {
    this.unloadingPageEvent();
    return false;
  }

  unloadingPageEvent() {
    this.saveSensorList();
    if (this.idxList != []) {
      localStorage.setItem('idx', JSON.stringify(this.idxList));
    }
  }

  public ngOnDestroy() {
    this.unloadingPageEvent();
  }

  /**
   * @function this method locks the sensor list through blocking pointer events in the css
   */
  lockSensors() {
    this.locked = !this.locked;
    if (this.locked == true) {
      this.style = "pointer-events: none"
      this.isLocked = "fa fa-lock";
      this.lockText = "Locked";
    } else {
      this.style = "";
      this.isLocked = "fa fa-unlock";
      this.lockText = "Locked";
      this.lockText = "Unlocked";
    }
  }

  setCurrentSensor(sensor: Sensor): void {
    this.currentSensor = sensor;
  }

  checkIfSelected(sensorType: string) {
    //checks the checkbox if the sensor is active
    let sensor = this.sensorsService.getSensorByType(sensorType);
    if (sensor == undefined) return false;

    return this.sensors.includes(sensor);
  }

  //this method is called when a sensor has changed
  onSensorChange(event) {
    const isChecked = event.currentTarget.checked;
    const checkedId = event.currentTarget.id;
    const sensor = this.sensorsService.getSensorByType(checkedId);

    if (isChecked == true) {
      this.sensors.push(sensor);
    } else if (isChecked == false) {
      let eventObject = this.sensors.indexOf(sensor);
      this.sensors.splice(eventObject, 1);
    }
  }

  saveSensorList() {

    this.idxList = [];
    for (let i = 0; i < this.sensors.length; i++) {
      let idx = this.sensors[i].idx
      this.idxList.push(idx);
    }
    this.sensorsService.idxLocalStorage = this.idxList;
    this.sensorsService.lockedLocalStorage = String(this.locked);
  }

  updateCurrentSensor(): void {
    this.newNoteEvent.emit();
  }


  /**
   * @function this method maintains the integrity of which sensors are in the sensors list through the localstorage
   */
  checkList(array, checkList): Sensor[] {
    if (array == null || this.sensors == null) return null;

    if (checkList == null)
      checkList = this.sensorsService.getMap().get(this.userService.user.specialty);

    let sensorsCopy: Sensor[] = [...this.sensors];


    for (let i = array.length - 1; i > -1; i--) {
      let sensor: Sensor = array[i]

      if (!checkList.includes(sensor.idx)) sensorsCopy.splice(i, 1);
    }
    return sensorsCopy;
  }

}

