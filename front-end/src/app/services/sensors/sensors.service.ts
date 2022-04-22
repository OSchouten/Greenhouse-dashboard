import {Injectable} from '@angular/core';
import {Sensor} from "../../models/sensor";
import {Temperature} from "../../models/units";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {AccountsService} from "../accounts/accounts.service";


@Injectable({
  providedIn: 'root'
})


export class SensorsService {
  public sensors: Sensor[] = [];
  private dataValue: Temperature;
  private minValue: number;
  private maxValue: number;
  private MIN_VALUE: number = 10.0;
  private MAX_VALUE: number = 40.0;
  private starterOrderMap: Map<string, Array<number>> = new Map();

  constructor(private http: HttpClient, private accountsService: AccountsService) {
  }

  public getAllSensors() {
    return this.sensors;
  }

  public getMap() {
    this.setOrderMap();
    return this.starterOrderMap;
  }

  setOrderMap() {
    this.starterOrderMap.set('Biology', [5, 3, 4, 1, 2, 6, 7, 9, 10, 8]);
    this.starterOrderMap.set('Agronomy', [3, 5, 7, 8, 2, 1, 9, 4, 6, 10]);
    this.starterOrderMap.set('Botany', [5, 6, 4, 9, 2, 1, 9, 10, 8, 7]);
    this.starterOrderMap.set('Geology', [5, 4, 3, 7, 6, 1, 2, 8, 9, 10]);
    this.starterOrderMap.set('Hydrology', [6, 7, 4, 10, 8, 3, 1, 2, 5, 9]);
    this.starterOrderMap.set('ClimateScience', [10, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    this.starterOrderMap.set('Admin', [10, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }

  public getSensorByIdentifier(identifier: string): Sensor {
    return this.sensors.find(o => o.identifier === identifier);
  }

  /**
   * @deprecated
   * @param idx
   */
  public getSensorIdentifierFromIdx(idx: number): string {
    return this.getAllSensors().find(o => o.idx === idx && o.identifier.endsWith(this.accountsService.user.teamId.toString()))?.identifier;
  }

  async loadSensors() {
    this.sensors = [];
    let list = await this.getSensorsForTeam(4);
    list.forEach(sensor => {
      this.addSensor(Object.assign(new Sensor(), sensor))
    });
    this.sensors = this.mapOrder(this.sensors, this.idxLocalStorage);
  }

  public set idxLocalStorage(idxList: number[]) {
    localStorage.setItem("idx", JSON.stringify(idxList));
  }

  public get idxLocalStorage(): number[] {
    return JSON.parse(localStorage.getItem('idx'));
  }

  public set lockedLocalStorage(idxList: string) {
    localStorage.setItem("locked", JSON.stringify(idxList));
  }

  public get lockedLocalStorage(): string {
    return JSON.parse(localStorage.getItem('locked'));
  }

  public async getSensorsForTeam(team_id: number): Promise<Sensor[]> {
    return this.http.get<Sensor[]>(`${environment.BACKEND_URL}/team/${team_id}/sensors`).toPromise();
  }

  public async getSensorDataForNameAndTeamId(team_id: number, sensorName: string, limit?: number): Promise<Sensor> {
    return this.restGetSensor(team_id, sensorName, limit).toPromise();
  }

  public restGetSensor(team_id: number, sensorType: string, limit?: number): Observable<Sensor> {
    if (limit === undefined) return this.http.get<Sensor>(`${environment.BACKEND_URL}/team/${team_id}/sensor/${sensorType}`);
    else return this.http.get<Sensor>(`${environment.BACKEND_URL}/team/4/sensor/${sensorType}?limit=${limit}`);
    /*
        return this.http.get<any>("http://localhost:8080" + "/team/" + team_id + "/sensor/" + sensorType);
    */
  }

  public restUpdateSensor(gh_id: number, sensorType: string, selectedValue: any, team_id, user_id: string) {
    let json = {
      "user_id": user_id,
      "gh_id": gh_id,
    }
    json[sensorType] = selectedValue;

    return this.http.post<any>(`${environment.BACKEND_URL}/team/${gh_id}/sensors`, json)
  }

  public addSensor(sensor: Sensor): boolean {
    //adds a sensor to the selectedSensors and returns true if the sensor has been added
    if (!this.sensors.includes(sensor)) {
      this.sensors.push(sensor);
      return true;
    } else
      return false;
  }

  public removeSelectedSensor(sensor: Sensor): boolean {
    //removes the sensor from selectedSensors and returns true if the sensor has been deleted

    if (this.sensors.includes(sensor)) {
      const index = this.sensors.indexOf(sensor);

      this.sensors.splice(index, 1);
      return true;
    } else return false;
  }

  public getSensors(): Sensor[] {
    //returns the selectedSensors array
    return this.sensors;
  }

  public getSensorByType(type: string): Sensor {
    if (this.sensors.length > 0) {
      let sensor: Sensor = this.sensors.find(data => data.sensorType == type);
      return sensor
    }
    return null;
    //throw new Error('No sensors in list')
  }

  public has(type: string) {
    let exists = false;
    this.sensors.forEach(o => {
      if (o.sensorType === type) exists = true;
    });
    return exists;
  }


  /**
   * @function this reorders the sensors based on the saved order from localstorage
   */
  mapOrder(array, order) {
    this.setOrderMap();
    //if new account with no localstorage a standard view depending on profession is shown
    if (array == undefined)
      return false;

    if (order == null)
      order = this.starterOrderMap.get(this.accountsService.user.specialty);

    array.sort(function (a, b) {
      let A = a.idx, B = b.idx;

      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  };

}
