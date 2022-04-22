import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NotesComponent} from "../notes/notes.component";
import {SensorNote} from "../../models/notes/sensorNote";
import {AccountsService} from "../../services/accounts/accounts.service";
import {SensorNotesService} from "../../services/notes/sensor-notes.service";
import {ActivatedRoute} from "@angular/router";
import {Specialty} from "../../models/user";

@Component({
  selector: 'app-sensor-note',
  templateUrl: './sensor-note.component.html',
  styleUrls: ['./sensor-note.component.scss']
})
export class SensorNoteComponent implements OnInit, OnChanges {

  @ViewChild('appNotes') appNotes: NotesComponent<SensorNote>;
  name: string;
  public sensorNotes: SensorNote[] = [];
  public filteredNotes: SensorNote[] = [];

  constructor(private sensorNotesService: SensorNotesService, private userService: AccountsService, private route: ActivatedRoute) {
    console.log(window.location.href.split("/").pop())
    this.route.params.subscribe(async params => {
      const identifier = params["identifier"];
      this.sensorNotes = await this.sensorNotesService.getNotes(identifier);
      this.filteredNotes = this.sensorNotes;
    });
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
    });
  }

  public filters = {
    sort_methods: ["Date Added"],
    tags: this.getTags(),
  };

  updateQueries(o: { query: string, tags?: string[], sort_method?: string, radio_button?: { group: string, item: string | null }[] }) {
    let results = this.sensorNotes.filter(note =>
      note.header.toLowerCase().includes(o.query.toLowerCase()) ||
      note.content.toLowerCase().includes(o.query.toLowerCase())
    );

    if (o.tags !== undefined && o.tags?.length > 0) {
      results = results.filter(note => {
        let matches = true;
        for (let tag of o.tags) {
          if (!note.specialty.includes(Specialty[tag.toLocaleLowerCase()])) matches = false;
        }
        return matches;
      });
    }

    this.filteredNotes = [...results];
  }

  getTags(): string[] {
    let specialties = Object.values(Specialty)
    specialties.splice(specialties.indexOf(Specialty.administrator), 1);
    return specialties;
  }
}
