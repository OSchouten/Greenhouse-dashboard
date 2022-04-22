package ccu.four.backend.controllers;

import ccu.four.backend.exceptions.PreConditionFailed;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.Team;
import ccu.four.backend.repositories.team.TeamRepositoryJpa;
import ccu.four.backend.services.GreenhouseService;
import ccu.four.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("team")
public class TeamController {

    @Autowired
    TeamRepositoryJpa teamRepositoryJpa;

    @Autowired
    GreenhouseService greenhouseService;

    @GetMapping("/{id}")
    public Team getById(@PathVariable long id) {
        return teamRepositoryJpa.findById(id);
    }

    @PostMapping("")
    @JsonView(Views.Public.class)
    public Team addTeam(@RequestBody Team team) {
        return teamRepositoryJpa.save(team);
    }

    @PutMapping("/{id}")
    @JsonView(Views.Public.class)
    public Team updateTeam(@PathVariable long id, @RequestBody Team team) {
        if (id != team.getId()) throw new PreConditionFailed("Given ID does not match team id.");
        Team updatedTeam = this.getById(team.getId());
        updatedTeam.setTeamName(team.getTeamName());
        return teamRepositoryJpa.update(updatedTeam);
    }

    @DeleteMapping("/{id}")
    @JsonView(Views.Public.class)
    public Team deleteTeam(@PathVariable long id) {
        try {
            return teamRepositoryJpa.delete(id);
        } catch (NotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @GetMapping("notes/{id}")
    @JsonView(Views.Notes.class)
    public Team getAllNotes(@PathVariable long id) {
        return this.getById(id);
    }

    @GetMapping("users/{id}")
    @JsonView(Views.Users.class)
    public Team getAllUsers(@PathVariable long id) {
        return this.getById(id);
    }

    @GetMapping("{id}/sensors")
    public List<Sensor> getAllSensors(@PathVariable long id) {
        return this.getById(id).getSensors();
    }

    @GetMapping("all")
    @JsonView(Views.Public.class)
    public List<Team> getAllTeams() {
        return teamRepositoryJpa.findAll();
    }
}
