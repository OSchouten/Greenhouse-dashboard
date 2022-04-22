package ccu.four.backend.controllers;

import ccu.four.backend.models.note.Note;
import ccu.four.backend.models.note.SensorNote;
import ccu.four.backend.models.note.TeamNote;
import ccu.four.backend.repositories.note.NoteRepositoryJpa;
import ccu.four.backend.repositories.sensor.SensorRepository;
import ccu.four.backend.repositories.team.TeamRepository;
import ccu.four.backend.requestBodies.TeamNoteRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("note")
public class NoteController {

    @Autowired
    NoteRepositoryJpa noteRepositoryJpa;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    SensorRepository sensorRepository;

    @GetMapping("team/id/{id}")
    public Note getTeamNote(@PathVariable long id) {
        return noteRepositoryJpa.findTeamNoteById(id);
    }

    @GetMapping("sensor/id/{id}")
    public Note getSensorNote(@PathVariable long id) {
        return noteRepositoryJpa.findSensorNoteById(id);
    }

    //Testing only
    @GetMapping("all")
    public List<Note> getAllNotes() {
        return noteRepositoryJpa.findAll();
    }

    //Testing only
    @GetMapping("all/sensor")
    public List<Note> getAllSensorNotes() {
        return noteRepositoryJpa.findAllSensorNotes();
    }

    @GetMapping("team/{id}")
    public List<TeamNote> getTeamNotes(@PathVariable long id) {
        return teamRepository.findById(id).getNotes();
    }

    @GetMapping("sensor/{identifier}")
    public List<SensorNote> getSensorNotes(@PathVariable String identifier) {
        return sensorRepository.findBySurrogateKey(identifier).getNotes();
//        return noteRepositoryJpa.findByNativeQuery("sensorNotes", identifier);
    }

    @GetMapping("all/team")
    public List<Note> getAllTeamNotes() {
        return noteRepositoryJpa.findAllTeamNotes();
    }

    @GetMapping("team/all/ifPublic")
    public List<TeamNote> getAllTeamNotesIfPublic() {
        return noteRepositoryJpa.getAllTeamNotesIfPublic();
    }

    @PostMapping("sensor/{identifier}")
    public Note addSensorNote(@RequestBody SensorNote note, @PathVariable String identifier) {
        note.setDate(Date.from(Instant.now()));
        return noteRepositoryJpa.saveSensorNote(note, identifier);
    }

    @PostMapping("team/{id}")
    public Note addTeamNote(@RequestBody TeamNoteRequestBody note, @PathVariable long id) {
        note.setDate(Date.from(Instant.now()));
        return noteRepositoryJpa.saveTeamNote(note, id);
    }

    //TODO -- MAYBE -- IF we want to show edited date, so original date + updated date, make date an array, sort by date when retrieving.
    @PutMapping("sensor/{identifier}")
    public Note updateSensorNote(@RequestBody SensorNote note, @PathVariable String identifier) {
        // note.setDate(Date.from(Instant.now()));
        System.out.println(identifier);
        return noteRepositoryJpa.updateSensorNote(note, identifier);
    }

    @PutMapping("team/{id}")
    public Note updateTeamNote(@RequestBody TeamNoteRequestBody note, @PathVariable long id) {
        // note.setDate(Date.from(Instant.now()));
        return noteRepositoryJpa.updateTeamNote(note, id);
    }

    @DeleteMapping("team/{id}")
    public TeamNote deleteTeamNote(@PathVariable long id) {
        return noteRepositoryJpa.deleteTeamNote(id);
    }

    @DeleteMapping("sensor/{id}")
    public SensorNote deleteSensorNote(@PathVariable long id) {
        return noteRepositoryJpa.deleteSensorNote(id);
    }

}
