import {Component, OnInit} from '@angular/core';
import {TeamNote} from "../../models/notes/teamNote";
import {TeamNotesService} from 'src/app/services/notes/team-notes.service';
import {AccountsService} from "../../services/accounts/accounts.service";
import {TeamsService} from "../../services/teams/teams.service";
import {Specialty} from "../../models/user";
import {Note} from "../../models/notes/note";
import {NotesService} from "../../services/notes/notes.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-add-team-note',
  templateUrl: './add-team-note.component.html',
  styleUrls: ['./add-team-note.component.scss'],
})
export class AddTeamNoteComponent implements OnInit {

  public note: TeamNote;
  public note1: Note = new TeamNote();
  public tags: string[] = [];
  public options = {}

  constructor(private teamNotesService: TeamNotesService, private accountsService: AccountsService, private teamsService: TeamsService, private route: ActivatedRoute, private router: Router) {
    this.resetNote();
    this.tags = this.getTags();

    if (window.location.href.split("/").pop() != "create") {
      this.route.params.subscribe(params => {
        this.loadNote<TeamNote>(teamNotesService, +params["id"]);
      });
    }
  }

  async loadNote<T extends Note>(notesService: NotesService<T>, id: number) {
    this.note1 = await notesService.getNote(id);
    this.note = <TeamNote>this.note1;
  }

  async resetNote() {
    this.note = TeamNote.getEmpty();
    this.note.user = this.accountsService.user;
  }

  getCurrentType() {
    return this.getType(this.note.isPublic)
  }

  getType(isPublic: boolean) {
    return isPublic ? "Progress Report" : "Team Note";
  }

  submitNote() {
    if (this.note.header.match(/^\s+$/) || this.note.content.match(/^\s+$/)) {
      alert('You can\'t leave any spaces blank.');
      return;
    }
    if (window.location.href.split("/").pop() == "create"){
      this.teamNotesService.saveNote(<TeamNote>this.note).then(sentNote => {
        console.log("Sent working")
      });}
    else
      this.teamNotesService.updateNote(<TeamNote>this.note).then(sentNote => {
        console.log("Sent working")
      });

    this.router.navigate(["dashboard"]);

  }

  toggleTag(tag: string) {
    if (this.tagIsSelected(tag)) {
      for (let i = 0; i < this.note.specialties.length; i++) {
        if (this.note.specialties[i] === Specialty[this.tagConverter[tag]]) {
          this.note.specialties.splice(i, 1);
          return;
        }
      }
    } else this.note.specialties.push(Specialty[this.tagConverter[tag]]);
  }

  getTags(): string[] {
    let specialties = Object.values(Specialty)
    specialties.splice(specialties.indexOf(Specialty.administrator), 1);
    return specialties;
  }

  tagIsSelected(tag: string): boolean {
    return this.note.specialties.includes(Specialty[this.tagConverter[tag]]);
  }

  ngOnInit(): void {
  }

  private tagConverter = {
    "Climate Science": "climateScience",
    Agronomy: "agronomy",
    Botany: "botany",
    Geology: "geology",
    Hydrology: "hydrology",
    Admin: "administrator"
  };

}
