package ccu.four.backend.requestBodies;

import ccu.four.backend.enums.Specialty;
import ccu.four.backend.models.note.Note;
import ccu.four.backend.models.note.TeamNote;
import com.fasterxml.jackson.annotation.JsonAlias;

import java.util.ArrayList;
import java.util.List;

public class TeamNoteRequestBody extends Note {

    public TeamNoteRequestBody() {

    }

    public TeamNoteRequestBody(TeamNote teamNote) {
        super();
        this.specialties = new ArrayList<>(teamNote.getSpecialties());
        this.isPublic = teamNote.isPublic();
        super.setContent(teamNote.getContent());
        super.setId(teamNote.getId());
        super.setUser(teamNote.getUser());
        super.setDate(teamNote.getDate());
        super.setHeader(teamNote.getHeader());
    }

    private List<Specialty> specialties;
    private boolean isPublic;

    public List<Specialty> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(List<Specialty> specialties) {
        this.specialties = specialties;
    }

    public boolean getPublic() {
        return isPublic;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public void setIsPublic(boolean aPublic) {
        isPublic = aPublic;
    }
}
