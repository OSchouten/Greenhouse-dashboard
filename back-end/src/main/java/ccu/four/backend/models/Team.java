package ccu.four.backend.models;

import ccu.four.backend.models.note.TeamNote;
import ccu.four.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

    @Id
    @JsonView(Views.Minimal.class)
    private Long id;

    @Column(nullable = false)
    @JsonView(Views.Minimal.class)
    private String teamName;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "team")
    @JsonView(Views.Notes.class)
    @JsonManagedReference
    private List<TeamNote> notes;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "team")
    @JsonView(Views.Users.class)
//    @JsonManagedReference
    private List<User> users;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "team")
    @JsonView(Views.Sensors.class)
    @Fetch(FetchMode.SELECT)
    @JsonManagedReference
    private List<Sensor> sensors;

    public Team(Long id, String teamName) {
        this.id = id;
        this.teamName = teamName;
    }

    public Team(String teamName) {
        this.teamName = teamName;
    }

    public Team() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<TeamNote> getNotes() {
        return notes;
    }

    public List<User> getUsers() {
        return users;
    }

    public List<Sensor> getSensors() {
        return new ArrayList<>(sensors);
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Team-" + id + " {" +
                teamName +
                '}';
    }
}
