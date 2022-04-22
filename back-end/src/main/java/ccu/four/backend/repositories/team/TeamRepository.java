package ccu.four.backend.repositories.team;

import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Team;
import javassist.NotFoundException;

import java.util.List;

public interface TeamRepository {
    public List<Team> findAll();

    public Team findById(long id) throws ResourceNotFound;

    public Team update(Team team);

    public Team save(Team team);

    public Team delete(long id) throws NotFoundException;

    public Team delete(Team team);
}
