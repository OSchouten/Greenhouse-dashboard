import {Injectable} from '@angular/core';
import {NotesService} from "./notes.service";
import {TeamNote} from "../../models/notes/teamNote";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AccountsRestAdaptorService} from "../accounts/accounts-rest-adaptor.service";

@Injectable({
  providedIn: 'root'
})
export class TeamNotesService extends NotesService<TeamNote> {
  public readonly resourceUrl = `${environment.BACKEND_URL}/note/team`;
  public progressReports = [];

  constructor(private http: HttpClient, private as: AccountsRestAdaptorService) {
    super(http, as);
    super.empty = TeamNote.getEmpty();
  }


  async getPublicNote() {
    // Get note.
    let notes = await this.http.get<TeamNote[]>(`${this.resourceUrl}/all/ifPublic`).pipe().toPromise();
    this.progressReports = [...notes];
    return notes;
  }

  public getPublicNotes(): TeamNote[] {
    //returns the notes array
    return this.progressReports;
  }

}
