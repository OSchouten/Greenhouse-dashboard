import {Component, OnInit} from '@angular/core';
import {TeamNotesService} from "../../services/notes/team-notes.service";
import {AccountsService} from "../../services/accounts/accounts.service";
import {TeamsService} from "../../services/teams/teams.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SensorNotesService} from "../../services/notes/sensor-notes.service";
import {SensorNote} from "../../models/notes/sensorNote";
import {Note} from "../../models/notes/note";
import {NotesService} from "../../services/notes/notes.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-sensor-note',
  templateUrl: './add-sensor-note.component.html',
  styleUrls: ['./add-sensor-note.component.scss']
})
export class AddSensorNoteComponent implements OnInit {

  public note: SensorNote;
  public note1: Note = new SensorNote();
  public tags: string[] = [];
  public options = {}

  constructor(private location: Location, private teamNotesService: TeamNotesService, private accountsService: AccountsService, private teamsService: TeamsService, private route: ActivatedRoute, private router: Router, private sensorNoteService: SensorNotesService) {
    this.resetNote();

    if (window.location.href.split("/").pop() != "new")
      this.route.params.subscribe(params => {
        this.loadNote<SensorNote>(sensorNoteService, +params["id"]);
      });
  }

  async loadNote<T extends Note>(notesService: NotesService<T>, id: number) {
    this.note1 = await notesService.getNote(id);
    this.note = <SensorNote>this.note1;
  }

  async resetNote() {
    this.note = SensorNote.getEmpty();
    this.note.user = this.accountsService.user;
  }

  submitNote() {
    if (this.note.header.match(/^\s+$/) || this.note.content.match(/^\s+$/)) {
      alert('You can\'t leave any spaces blank.');
      return;
    }
    this.note.specialty = this.accountsService.user.specialty;
    if (window.location.href.split("/").pop() == "new") {
      this.note.sensorId = window.location.href.split("/").slice()[6]
      this.sensorNoteService.saveNote(this.note).then(sentNote => {
        console.log("Sent working")
      });
    } else {
      this.note.sensorId = window.location.href.split("/").pop();
      this.sensorNoteService.updateNote(this.note).then(sentNote => {
        console.log("Sent working")
      });
    }
    this.router.navigate(["dashboard"]);
  }

  ngOnInit(): void {
  }
}
