package ccu.four.backend.models.note;

import ccu.four.backend.enums.Specialty;
import ccu.four.backend.models.Team;
import ccu.four.backend.requestBodies.TeamNoteRequestBody;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class TeamNote extends Note {

    // TODO: Make nullable false, it's true for testing purposes.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teamId", nullable = true)
    @JsonBackReference
    private Team team;

    @ElementCollection
    private List<Specialty> specialties;

    private boolean isPublic;

    public TeamNote() {
        super();
        this.specialties = new ArrayList<>();
    }

    public TeamNote(Team team) {
        super();
        this.specialties = new ArrayList<>();
        this.team = team;
    }

    public TeamNote(Team team, String header, String content) {
        super(header, content);
        this.team = team;
        this.specialties = new ArrayList<>();
    }

    public TeamNote(TeamNoteRequestBody teamNoteRequestBody) {
        super();
        super.setHeader(teamNoteRequestBody.getHeader());
        super.setContent(teamNoteRequestBody.getContent());
        super.setDate(teamNoteRequestBody.getDate());
        super.setId(teamNoteRequestBody.getId());
        super.setUser(teamNoteRequestBody.getUser());
        this.setPublic(teamNoteRequestBody.getPublic());
        this.specialties = new ArrayList<>(teamNoteRequestBody.getSpecialties());
    }

    public void addSpecialty(Specialty specialty) {
        specialties.add(specialty);
    }

    public void addSpecialties(Specialty... args) {
        specialties.addAll(List.of(args));
    }

    public void removeSpecialty(Specialty specialty) {
        specialties.remove(specialty);
    }

    public Team getTeam() {
        return team;
    }

    public List<Specialty> getSpecialties() {
        return specialties;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
