import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AccountsRestAdaptorService} from "../accounts/accounts-rest-adaptor.service";
import {Note} from "../../models/notes/note";


@Injectable({
  providedIn: 'root'
})
export abstract class NotesService<T extends Note> {


  public notes: T[];
  public readonly abstract resourceUrl: string;

  protected set empty(empty: T) {
    this._empty = empty;
  }

  protected get empty(): T {
    return this._empty.getEmpty() as any;
  }

  private _empty: T;

  private static accountsService: AccountsRestAdaptorService

  constructor(protected _http: HttpClient, protected _accountService: AccountsRestAdaptorService) {
    this.notes = [];
    NotesService.accountsService = this._accountService;
  }

  public async getNote(ID: number): Promise<T> {
    let localNote = this.getLocalNote(ID);
    if (localNote) return this.trueCopy(localNote);
    let note = await this._http.get<T>(`${this.resourceUrl}/id/${ID}`,).toPromise();
    note = await this.trueCopy(note);
    if (note) this.addLocalNote(note);
    return note;
  }

  public async getNotes(parentIdentifier: string | number): Promise<T[]> {
    let notes = await this._http.get<T[]>(`${this.resourceUrl}/${parentIdentifier}`,).toPromise();
    let result = [];
    for (let note of notes) {
      result.push(await this.trueCopy(note));
      this.addLocalNote(note);
    }
    return result;
  }

  public async getAllNotes() {
    let notes = await this._http.get<T[]>(`${this.resourceUrl}/`,).toPromise();
    let result = [];
    for (let note of notes) {
      result.push(await this.trueCopy(note));
      this.addLocalNote(note);
    }
    return result;
  }

  public async updateNote(note: T): Promise<Boolean> {
    let updatedNote = await this._http.put<T>(`${this.resourceUrl}/${note.user.teamId}`, note).toPromise();
    this.removeLocalNote(note);
    return this.addLocalNote(updatedNote);
  }

  public async saveNote(note: T): Promise<boolean> {
    //adds a note to the notes list and returns true if the note has been added
    let addedNote = await this._http.post<T>(`${this.resourceUrl}/${note.user.teamId}`, note).toPromise();
    if (!addedNote) return false;
    note = await this.trueCopy(note);
    return this.addLocalNote(note);
  }

  public async removeNote(note: T): Promise<boolean> {
    let flawless = true;

    await this._http.delete<T>(`${this.resourceUrl}/${note.id}`).toPromise().catch(e => {
      flawless = false
    });
    if (flawless) this.removeLocalNote(note);
    return flawless;
  }

  public getLocalNotes(): T[] {
    return [...this.notes];
  }

  private getLocalNote(ID: string | number): T {
    return this.notes.find(o => o.id === ID);
  }

  private removeLocalNote(note: T): boolean {
    if (!note) return false;
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id === note.id) {
        this.notes.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  protected addLocalNote(note: T): boolean {
    if (!note || this.hasNote(note)) return false;
    this.notes.push(note);
    return true;
  }

  public static async trueCopy<Type extends Note>(note: Type) {
    note = Object.assign(note.getEmpty(), note);
    note.user = await this.accountsService.asyncFindById(note.user.id);
    return note;
  }

  protected async trueCopy(note: T) {
    note = Object.assign(this.empty, note);
    note.user = await this._accountService.asyncFindById(note.user.id);
    return note;
  }

  private hasNote(note: T): boolean {
    return !!this.notes.find(o => o.id === note.id);
  }

  public addAllNotes() {
    if (this.notes.length > 0) return;
  }
}

