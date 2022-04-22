import {Component, OnInit, ViewChild} from '@angular/core';
import {NotesComponent} from "../notes/notes.component";
import {TeamNote} from "../../models/notes/teamNote";
import {Specialty, User} from "../../models/user";
import {query} from "@angular/animations";
import {TeamNotesService} from "../../services/notes/team-notes.service";
import {AccountsService} from "../../services/accounts/accounts.service";

@Component({
  selector: 'app-team-notes',
  templateUrl: './team-notes.component.html',
  styleUrls: ['./team-notes.component.scss']
})
export class TeamNotesComponent implements OnInit {

  @ViewChild('appNotes') appNotes: NotesComponent<TeamNote>;

  public visibleNotes: TeamNote[] = [];

  private _notes: TeamNote[] = [];
  private set notes(notes: TeamNote[]) {
    this._notes = notes;
    this.visibleNotes = [...this.notes];
  }

  private get notes(): TeamNote[] {
    return this._notes;
  }

  public filters = {
    sort_methods: ["Date Added"],
    tags: this.getTags(),
    radio_buttons: [
      {
        group: "visibility",
        items: [
          {name: "Public", icon: "unlock"},
          {name: "Private", icon: "lock"}
        ]
      }
    ]
  };

  constructor(private teamNotesService: TeamNotesService, private userService: AccountsService) {
    this.loadNotes();
  }

  async loadNotes() {
    let notes = await this.teamNotesService.getNotes(this.userService.user.teamId);
    this.notes = notes;
  }

  ngOnInit(): void {
  }

  getTags(): string[] {
    let specialties = Object.values(Specialty)
    specialties.splice(specialties.indexOf(Specialty.administrator), 1);
    return specialties;
  }

  updateQueries(o: { query: string, tags?: string[], sort_method?: string, radio_button?: { group: string, item: string | null }[] }) {
    let results = this.notes.filter(note =>
      note.header.toLowerCase().includes(o.query.toLowerCase()) ||
      note.content.toLowerCase().includes(o.query.toLowerCase())
    );

    if (o.tags !== undefined && o.tags?.length > 0) {
      results = results.filter(note => {
        let matches = true;
        for (let tag of o.tags) {
          if (!note.specialties.includes(Specialty[tag.toLocaleLowerCase()])) matches = false;
        }
        return matches;
      });
    }

    if (o.radio_button[0].item !== null) {
      results = results.filter(note => {
        return note.isPublic === (o.radio_button[0].item === "Public");
      });
    }

    this.visibleNotes = [...results];
  }

}
