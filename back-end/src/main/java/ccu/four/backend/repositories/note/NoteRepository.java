package ccu.four.backend.repositories.note;

import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.Team;
import ccu.four.backend.models.note.Note;
import ccu.four.backend.models.note.SensorNote;
import ccu.four.backend.models.note.TeamNote;
import ccu.four.backend.requestBodies.TeamNoteRequestBody;
import javassist.NotFoundException;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface NoteRepository {
    public List<Note> findAll();

    public List<Note> findAllTeamNotes();

    public List<Note> findAllSensorNotes();

    public List<TeamNote> getAllTeamNotesIfPublic();

    public List<Note> findByNativeQuery(String jpqlName, Object... params);

    public List<Note> findAllByTeam(Team team);

    public List<Note> findAllBySensor(Sensor sensor);

    public SensorNote findSensorNoteById(long id) throws ResourceNotFound;
    public TeamNote findTeamNoteById(long id) throws ResourceNotFound;

    public SensorNote updateSensorNote(SensorNote sensorNote, String identifier);

    public SensorNote updateSensorNote(SensorNote sensorNote);

    public SensorNote saveSensorNote(SensorNote sensorNote, String identifier);

    public SensorNote saveSensorNote(SensorNote sensorNote);

    public TeamNote saveTeamNote(TeamNote teamNote);

    public TeamNote saveTeamNote(TeamNoteRequestBody teamNoteRequestBody, long teamId);

    public TeamNote updateTeamNote(TeamNote teamNote);

    public TeamNote updateTeamNote(TeamNoteRequestBody teamNoteRequestBody, long teamId);

    public SensorNote deleteSensorNote(long id) throws ResourceNotFound;
    public TeamNote deleteTeamNote(long id) throws ResourceNotFound;

}
