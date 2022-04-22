import {Injectable} from '@angular/core';
import {NotesService} from "./notes.service";
import {SensorNote} from "../../models/notes/sensorNote";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AccountsRestAdaptorService} from "../accounts/accounts-rest-adaptor.service";

@Injectable({
  providedIn: 'root'
})
export class SensorNotesService extends NotesService<SensorNote> {
  public readonly resourceUrl = `${environment.BACKEND_URL}/note/sensor`;

  constructor(private http: HttpClient, private as: AccountsRestAdaptorService) {
    super(http, as);
    super.empty = SensorNote.getEmpty();
  }

  async updateNote(note: SensorNote): Promise<Boolean> {
    let updatedNote = await this._http.put<SensorNote>(`${this.resourceUrl}/${note.sensorId}`, note).toPromise();

    return this.addLocalNote(updatedNote);
  }

  public async saveNote(note: SensorNote): Promise<boolean> {
    //adds a note to the notes list and returns true if the note has been added
    let addedNote = await this._http.post<SensorNote>(`${this.resourceUrl}/${note.sensorId}`, note).toPromise();
    if (!addedNote) return false;
    note = await this.trueCopy(note);
    return this.addLocalNote(note);
  }
}
