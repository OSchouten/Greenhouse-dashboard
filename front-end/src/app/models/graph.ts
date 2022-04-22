export class Graph {
  private _idx: number;
  private _title: string;
  private _type: string;
  private _minDate: Date;
  private _maxDate: Date;
  private _vAxisTitle: string;
  private _vAxisMin: any;
  private _vAxisMax: any;
  private _dataRows: any;

  constructor(idx, title, type, minDate, maxDate, vAxisTitle, vAxisMin, vAxisMax, dataRows) {
    this._idx = idx;
    this._title = title;
    this._type = type;
    this._minDate = minDate;
    this._maxDate = maxDate;
    this._vAxisTitle = vAxisTitle;
    this._vAxisMin = vAxisMin;
    this._vAxisMax = vAxisMax;
    this._dataRows = dataRows;
  }

  get title(): string {
    return this._title;
  }

  get type(): string {
    return this._type;
  }

  get maxDate(): Date {
    return this._maxDate;
  }

  get minDate(): Date {
    return this._minDate;
  }

  get vAxisTitle(): string {
    return this._vAxisTitle;
  }

  get vAxisMin(): any {
    return this._vAxisMin;
  }

  get dataRows(): any {
    return this._dataRows;
  }


  get vAxisMax(): any {
    return this._vAxisMax;
  }

  set title(value: string) {
    this._title = value;
  }

  set type(value: string) {
    this._type = value;
  }

  set maxDate(value: Date) {
    this._maxDate = value;
  }

  set minDate(value: Date) {
    this._minDate = value;
  }

  set vAxisTitle(value: string) {
    this._vAxisTitle = value;
  }

  set vAxisMin(value: any) {
    this._vAxisMin = value;
  }

  set dataRows(value: any) {
    this._dataRows = value;
  }

  set vAxisMax(value: any) {
    this._vAxisMax = value;
  }

  get idx(): number {
    return this._idx;
  }

  set idx(value: number) {
    this._idx = value;
  }
}
