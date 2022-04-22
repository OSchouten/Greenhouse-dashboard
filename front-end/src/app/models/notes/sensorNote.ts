import {Specialty} from "../user";
import {Note} from "./note";

export class SensorNote extends Note {
  public sensorId: string;
  public specialty: Specialty;

  public static readonly path = "sensor";

  public getPath(): string {
    return SensorNote.path;
  }

  public getParentID(): string {
    return this.sensorId;
  }

  public getIdentifier(): string | number {
    return this.sensorId;
  }

  public getListOfSpecialties(): Specialty[] {
    return [this.specialty];
  }

  public static getEmpty(): SensorNote {
    return new SensorNote();
  }

  public getEmpty(): SensorNote {
      return SensorNote.getEmpty();
  }

}
