import {Note} from "./notes/note";
import {SensorNote} from "./notes/sensorNote";
import {Measures} from "./measures";

export class Sensor {

  private _identifier: string;
  private _idx: number;
  private _sensorType: string;
  private _minValue: number;
  private _maxValue: number;
  private _unit: Measures;
  private _readableName: string;
  private _description: string;
  private _notes: SensorNote[];
  private _valueStep: number;
  private _targets: [{ "date": Date, "value": string }]
  private _values: [{ "date": Date, "value": string }]

  constructor(idx?: number, sensorType?: string, minValue?: number, maxValue?: number, unit?: Measures, readableName?: string, description?: string, valueStep?: number, identifier?: string) {
    this._identifier = identifier;
    this._idx = idx;
    this._sensorType = sensorType;
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._unit = unit;
    this._readableName = readableName;
    this._description = description;
    this._notes = [];
    this._valueStep = valueStep;
  }

  public addNote(note: SensorNote): void {
    this._notes.push(note);
  }

  public removeNote(note: Note): boolean {
    for (let i = 0; i < this._notes.length; i++) {
      if (this._notes[i] === note) {
        this._notes.splice(i, 1)
        return true;
      }
    }
    throw new Error('Note not found');
  }

  get notes(): SensorNote[] {
    return this._notes;
  }

  set minValue(value: number) {
    this._minValue = value;
  }

  set maxValue(value: number) {
    this._maxValue = value;
  }

  set unit(value: Measures) {
    this._unit = value;
  }

  set readableName(value: string) {
    this._readableName = value;
  }

  set description(value: string) {
    this._description = value;
  }

  get idx(): number {
    return this._idx;
  }

  get sensorType(): string {
    return this._sensorType;
  }

  get minValue(): number {
    return this._minValue;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  get unit(): Measures {
    return this._unit;
  }

  get readableName(): string {
    return this._readableName;
  }

  get description(): string {
    return this._description;
  }


  get valueStep(): number {
    return this._valueStep;
  }


  get identifier(): string {
    return this._identifier;
  }

  set identifier(value: string) {
    this._identifier = value;
  }

  set idx(value: number) {
    this._idx = value;
  }

  set sensorType(value: string) {
    this._sensorType = value;
  }

  set notes(value: SensorNote[]) {
    this._notes = value;
  }

  set valueStep(value: number) {
    this._valueStep = value;
  }

  set targets(value: [{ date: Date; value: string }]) {
    this._targets = value;
  }

  set values(value: [{ date: Date; value: string }]) {
    this._values = value;
  }
}
