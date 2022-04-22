package ccu.four.backend.repositories.team;

import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Team;
import javassist.NotFoundException;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class TeamRepositoryJpa implements TeamRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Team> findAll() {
        return em.createQuery("SELECT c FROM Team c").getResultList();
    }

    @Override
    public Team findById(long id) throws ResourceNotFound {
        Team team = em.find(Team.class, id);
        if (team == null) throw new ResourceNotFound("Couldn't find a team by the given id.");
        return team;
    }

    @Override
    public Team update(Team team) {
        em.persist(team);
        System.out.println(team.toString());
        return team;
    }

    @Override
    public Team save(Team team) {
        team.setId(team.getId());
        return update(team);
    }

    @Override
    public Team delete(long id) throws NotFoundException {
        Team team = this.findById(id);
        return this.delete(team);
    }

    @Override
    public Team delete(Team team) {
        em.remove(team);
        return team;
    }
}
