import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SensorNote} from 'src/app/models/notes/sensorNote';
import {TeamNotesService} from 'src/app/services/notes/team-notes.service';
import {Note} from "../../models/notes/note";
import {TeamNote} from "../../models/notes/teamNote";
import {NotesService} from "../../services/notes/notes.service";
import {SensorNotesService} from "../../services/notes/sensor-notes.service";
import {getTimeAgo} from "../../utils/timeAgo";
import {User} from "../../models/user";
import {AccountsService} from "../../services/accounts/accounts.service";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  public note: Note = new TeamNote();
  public user: User;
  public getTimeAgo: Function = getTimeAgo;

  constructor(private route: ActivatedRoute, private router: Router, private sensorNoteService: SensorNotesService, private teamNoteService: TeamNotesService, private accountService: AccountsService) {
    this.route.params.subscribe(params => {
      if (params["type"] !== SensorNote.path && params["type"] !== TeamNote.path) this.router.navigate(["dashboard"]);
      if (params["type"] === TeamNote.path) this.loadNote<TeamNote>(teamNoteService, +params["id"]);
      if (params["type"] === SensorNote.path) this.loadNote<SensorNote>(sensorNoteService, +params["id"]);
    });
  }

  async loadNote<T extends Note>(notesService: NotesService<T>, id: number) {
    this.note = await notesService.getNote(id);
  }

  onEditNote(note: Note) {
    let typeString: string = "";

    if (note instanceof TeamNote) {
      typeString = TeamNote.path;
      this.router.navigate(['note/edit', typeString, note.id]);
    }
    if (note instanceof SensorNote) {
      let sensor = window.location.href.split("/").pop()
      typeString = SensorNote.path;
      this.router.navigate(['note/edit', typeString, note.id, sensor]);
    }


  }


  public goBack() {
    window.history.go(-1);
  }

  remove() {
    if (this.note instanceof SensorNote)
      this.sensorNoteService.removeNote(this.note);
    if (this.note instanceof TeamNote)
      this.teamNoteService.removeNote(this.note);
  }

  ngOnInit(): void {
    this.user = this.accountService.user;
  }


}
