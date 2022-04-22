package ccu.four.backend.repositories.note;

import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.Team;
import ccu.four.backend.models.User;
import ccu.four.backend.models.note.Note;
import ccu.four.backend.models.note.SensorNote;
import ccu.four.backend.models.note.TeamNote;
import ccu.four.backend.repositories.sensor.SensorRepository;
import ccu.four.backend.repositories.team.TeamRepository;
import ccu.four.backend.repositories.user.UserRepository;
import ccu.four.backend.requestBodies.TeamNoteRequestBody;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class NoteRepositoryJpa implements NoteRepository {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private SensorRepository sensorRepository;

    @Override
    public List<Note> findAll() {
        // TODO: Maybe move to native query to be able to sort by ID faster.
        List<Note> notes = this.findAllTeamNotes();
        notes.addAll(this.findAllSensorNotes());
        return notes;
    }

    @Override
    public List<Note> findAllTeamNotes() {
        return em.createQuery("SELECT t FROM TeamNote t").getResultList();
    }

    @Override
    public List<Note> findAllSensorNotes() {
        return em.createQuery("SELECT s FROM SensorNote s").getResultList();
    }

    @Override
    public List<Note> findAllByTeam(Team team) {
        return em.createQuery("SELECT t FROM TeamNote t WHERE t.team = :team")
                .setParameter("team", team)
                .getResultList();
    }

    @Override
    public List<Note> findAllBySensor(Sensor sensor) {
        return em.createQuery("SELECT s FROM SensorNote s WHERE s.sensor = :sensor")
                .setParameter("sensor", sensor)
                .getResultList();
    }

    @Override
    public List<TeamNote> getAllTeamNotesIfPublic() {
        return em.createQuery("SELECT s, t.teamName FROM TeamNote s JOIN Team t ON s.team = t WHERE s.isPublic = true ")
                .getResultList();
    }

    @Override
    public SensorNote findSensorNoteById(long id) throws ResourceNotFound {
        SensorNote note = em.find(SensorNote.class, id);
        if (note == null) throw new ResourceNotFound("Couldn't find a note by the given id.");
        return note;
    }

    @Override
    public TeamNote findTeamNoteById(long id) throws ResourceNotFound {
        TeamNote note = em.find(TeamNote.class, id);
        if (note == null) throw new ResourceNotFound("Couldn't find a note by the given id.");
        return note;
    }

    @Override
    public SensorNote updateSensorNote(SensorNote sensorNote, String identifier) {
        fetchAndSetUserForNote(sensorNote);
        fetchAndSetSensorForNote(sensorNote, identifier);
        em.merge(sensorNote);
        return sensorNote;
    }

    @Override
    public SensorNote updateSensorNote(SensorNote sensorNote) {
        return updateSensorNote(sensorNote, sensorNote.getSensor().getIdentifier());
    }

    @Override
    public SensorNote saveSensorNote(SensorNote sensorNote, String identifier) {
        sensorNote.setId(null);
        return updateSensorNote(sensorNote, identifier);
    }


    @Override
    public SensorNote saveSensorNote(SensorNote sensorNote) {
        return saveSensorNote(sensorNote, sensorNote.getSensor().getIdentifier());
    }

    @Override
    public TeamNote saveTeamNote(TeamNote teamNote) {
        return saveTeamNote(new TeamNoteRequestBody(teamNote), teamNote.getTeam().getId());
    }

    @Override
    public TeamNote saveTeamNote(TeamNoteRequestBody teamNoteRequestBody, long teamId) {
        teamNoteRequestBody.setId(null);
        return updateTeamNote(teamNoteRequestBody, teamId);
    }

    @Override
    public TeamNote updateTeamNote(TeamNote teamNote) {
        return updateTeamNote(new TeamNoteRequestBody(teamNote), teamNote.getTeam().getId());
    }

    @Override
    public TeamNote updateTeamNote(TeamNoteRequestBody teamNoteRequestBody, long teamId) {
        TeamNote teamNote = new TeamNote(teamNoteRequestBody);
        fetchAndSetTeamForNote(teamNote, teamId);
        fetchAndSetUserForNote(teamNote);
        em.merge(teamNote);
        return teamNote;
    }

    @Override
    public List findByNativeQuery(String jpqlName, Object... params) {
        Query query = em.createNamedQuery(jpqlName);
        for (int i = 0; i < params.length; i++) query.setParameter(i + 1, params[i]);
        return query.getResultList();
    }

    @Override
    public SensorNote deleteSensorNote(long id) throws ResourceNotFound {
        SensorNote note = this.findSensorNoteById(id);
        em.remove(note);
        return note;
    }

    @Override
    public TeamNote deleteTeamNote(long id) throws ResourceNotFound {
        TeamNote note = this.findTeamNoteById(id);
        em.remove(note);
        return note;
    }

    private void fetchAndSetUserForNote(Note note) {
        long userId = note.getUser().getId();
        User user = userRepository.findById(userId);
        note.setUser(user);
    }

    private void fetchAndSetSensorForNote(SensorNote note, String identifier) {
        Sensor sensor = sensorRepository.findBySurrogateKey(identifier);
        note.setSensor(sensor);
    }

    private void fetchAndSetTeamForNote(TeamNote note, long teamId) {
        Team team = teamRepository.findById(teamId);
        note.setTeam(team);
    }

}
