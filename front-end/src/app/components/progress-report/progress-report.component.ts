import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Note} from "../../models/notes/note";
import * as $ from 'jquery';
import {Team} from "../../models/team";
import {TeamsService} from "../../services/teams/teams.service";
import {AccountsRestAdaptorService} from "../../services/accounts/accounts-rest-adaptor.service";
import {TeamNotesService} from "../../services/notes/team-notes.service";

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss']
})
export class ProgressReportComponent implements OnInit {
  public notes: Note[];
  public filteredNotes: Note[];
  public teams: Team[] = [];

  public filterString: Team;
  public userSpecialty: string;
  public activeTeam: string;
  public isEmpty: boolean = true;

  @ViewChild('header') headerRef: ElementRef;
  @ViewChild('context') contextRef: ElementRef;

  constructor(private notesService: TeamNotesService, private teamService: TeamsService, private accountService: AccountsRestAdaptorService) {
  }

  ngOnInit() {
    this.setup().then(() =>
      this.filter()
    );
  }

  async setup() {
    //get notes from service
    await this.notesService.getPublicNote();
    this.notes = [...this.notesService.getPublicNotes()];

    //get teams
    this.teamService.getAllTeams().then(fetchedTeams => {
      this.teams = fetchedTeams;
    });

    const id = this.getAuthFromLocalStorage();

    if (id != null) {
      //fetch data en haal specialty op
      this.accountService.asyncFindById(Number(id)).then(fetchedTeams => {
        this.userSpecialty = fetchedTeams.specialty;

        // add userSpecialty to localStorage
        if (this.userSpecialty != null) {
          this.setSpecialtyFromLocalStorage(this.userSpecialty);
        }
      });
      // set null filterString null so the placeholder will set
      this.filterString = null;

      this.activeTeam = null;

      //add filter function
      this.filteredNotes = this.notes;
    }
  }

  filter() {
    // filter on click
    let btns = $('.buttons').click(function () {
      btns.removeClass('active');
      $(this).addClass('active');
    })

    this.triggerButtons();
  }

  triggerButtons() {
    const specialty = this.getSpecialtyFromLocalStorage();
    if (specialty != null) {
      let btn = $('.buttons').ready(function () {
        //loop door de totaal aantal note-links
        for (let i = 0; i < btn.length; i++) {
          if ($(".buttons").get(i).id == 'note-' + specialty) {
            //click op de specialty die in de localStorage staat.
            $('#note-' + specialty).trigger('click');
          }
        }
      })
      // filtert data van voor de eerste specialty.
      if (this.activeTeam == null) this.filteredNotes = this.notes.filter(note => note[0].specialties.indexOf(specialty) !== -1);
      else this.filteredNotes = this.notes.filter(note => note[1].indexOf(this.activeTeam) !== -1)
      this.isEmpty = this.filteredNotes.length == 0;
    } else {
      //if the user has no specialty, then we select all notes as a standard
      $('#all-category').trigger('click');
    }
  }

  filterNotes(searchString: String) {
    // filter by the given searchString and show the notes
    if (this.activeTeam == null) this.filteredNotes = this.notes.filter(note => note[0].specialties.indexOf(searchString) !== -1);
    else this.filteredNotes = this.notes.filter(note => note[0].specialties.indexOf(searchString) !== -1 &&
      note[1].indexOf(this.filterString.teamName) !== -1);

    this.isEmpty = this.filteredNotes.length == 0;
  }


  filterTeam() {
    // filter by team name
    if (this.filterString !== undefined && this.filterString !== null) {
      if (this.activeTeam !== this.filterString.teamName) {

        const specialty = this.getSpecialtyFromLocalStorage();

        if (this.activeTeam == null) this.filteredNotes = this.notes.filter(note => note[0].specialties.indexOf(specialty) !== -1);
        else this.filteredNotes = this.notes.filter(note => note[1].indexOf(this.activeTeam) !== -1)

        this.activeTeam = this.filterString.teamName;

        if (specialty != null) {
          this.filteredNotes = this.notes.filter(note => note[1].indexOf(this.filterString.teamName) !== -1
            && note[0].specialties.indexOf(specialty) !== -1)
          this.isEmpty = this.filteredNotes.length == 0;


          let btn = $('.buttons').ready(function () {
            //loop door de totaal aantal note-links
            for (let i = 0; i < btn.length; i++) {
              if ($(".buttons").get(i).id == 'note-' + specialty) {
                //click op de specialty die in de localStorage staat.
                $('#note-' + specialty).trigger('click');
              }
            }
          })
        } else {
          this.filteredNotes = this.notes.filter(note => note[1].indexOf(this.filterString.teamName) !== -1)
          this.isEmpty = this.filteredNotes.length == 0;

          $('#all-category').trigger('click');
        }
      }
    } else this.activeTeam = null;
  }

  removeTeamFilter() {
    if (this.activeTeam != null && this.filterString != null) {
      this.activeTeam = null;
      this.filterString = null;
      this.filter();
    }
  }


  filterAll() {
    // filter all notes
    if (this.activeTeam == null) this.filteredNotes = this.notes;
    else this.filteredNotes = this.notes.filter(note => note[1].indexOf(this.activeTeam) !== -1)
    this.isEmpty = this.filteredNotes.length == 0;
  }

  public setSpecialtyFromLocalStorage(userSpecialty: string) {
    localStorage.setItem("specialty", JSON.stringify(userSpecialty));
  }

  public getSpecialtyFromLocalStorage(): string {
    return JSON.parse(localStorage.getItem("specialty"));
  }

  public getAuthFromLocalStorage(): string {
    return JSON.parse(localStorage.getItem("authorization")).user.id;
  }

  get getTeams() {
    return this.teams;
  }
}
