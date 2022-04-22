package ccu.four.backend.models;

import ccu.four.backend.enums.Specialty;
import ccu.four.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue
    @JsonView(Views.Public.class)
    private long id;

    private String email;

    @JsonView(Views.Public.class)
    private String firstName;

    @JsonView(Views.Public.class)
    private String lastName;

    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teamId")
//    @JsonView(Views.Public.class)
//    @JsonBackReference
    @JsonIgnore
    private Team team;

    private Specialty specialty;

    @Transient
    private long teamId;

//    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL,
//            fetch = FetchType.LAZY, optional = false)
//    private RegistrationToken registrationToken;

    public User(String email, String firstName, String lastName, String password, Team team, Specialty specialty) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.team = team;
        this.specialty = specialty;
    }

    public User() {
    }

    @JsonProperty("teamId")
    public long getTeamTeamId() {
        if (team == null)
            return -1;

        return team.getId();
    }

    @JsonIgnore
    public long getTeamId() {
        return teamId;
    }

    @JsonProperty("teamId")
    public void setTeamId(long teamId) {
        this.teamId = teamId;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPassword() {
        return password;
    }

    public Team getTeam() {
        return team;
    }

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public static interface UserView {
        public static interface Public {
        }
    }
}
