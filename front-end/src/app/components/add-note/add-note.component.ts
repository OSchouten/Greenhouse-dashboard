import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SensorNote} from "../../models/notes/sensorNote";
import {NotesService} from "../../services/notes/notes.service";
import {AccountsService} from "../../services/accounts/accounts.service";
import {SensorsService} from "../../services/sensors/sensors.service";
import {SensorNotesService} from "../../services/notes/sensor-notes.service";

class EventEmitter {
}

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit, OnChanges {

  public sensorNote: SensorNote;
  @Input() sensorId: string;

  constructor(private notesService: SensorNotesService, private accountsService: AccountsService, private sensorService: SensorsService) {
   }

  ngOnChanges() {
    this.resetNote();
  }

  resetNote() {
    this.sensorNote = new SensorNote("", "");
    this.sensorNote.user = this.accountsService.user;
    this.sensorNote.specialty = this.accountsService.user.specialty;
    this.sensorNote.sensorId = this.sensorId;

  }


  removeBackDrop() {
    document.getElementById('modal').remove();
  }

  ngOnInit(): void {
  }

  addNote() {
    if (this.sensorNote.header.match(/^\s+$/) || this.sensorNote.content.match(/^\s+$/)) {
      alert('You can\'t leave any spaces blank.');
      return;
    }
this.sensorNote.sensorId = this.sensorId;
    this.notesService.saveNote(this.sensorNote).then(sentNote => {
      console.log("Sent working")
      this.resetNote();
    });
  }
}
