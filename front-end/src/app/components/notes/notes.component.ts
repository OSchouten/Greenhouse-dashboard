import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../models/notes/note";
import {TeamNote} from "../../models/notes/teamNote";
import {getTimeAgo} from "../../utils/timeAgo";
import {AccountsService} from "../../services/accounts/accounts.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SensorNote} from "../../models/notes/sensorNote";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  exportAs: 'appNotes'
})
export class NotesComponent<T extends Note> implements OnInit {

  @Input() notes: T[] = [];
  public getTimeAgo: Function = getTimeAgo;

  constructor(private us: AccountsService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
  }

  redirect() {
    this.router.navigate(['note/team/create']);
  }

  isTeamNote(note: Note): boolean {
    return note instanceof TeamNote;
  }

  castToTeamNote(note: Note): TeamNote {
    return note as TeamNote;
  }

  onSelectNote(note: Note) {
    let typeString: string = "";
    if (note instanceof TeamNote) {
      typeString = TeamNote.path;
      this.router.navigate(['note', typeString, note.id]);
    }
    if (note instanceof SensorNote) {
      typeString = SensorNote.path;
      let sensorId = window.location.href.split("/").pop();
      this.router.navigate(['note', typeString, note.id, sensorId]);
    }
  }
}
