package ccu.four.backend.repositories.user;

import ccu.four.backend.models.User;
import ccu.four.backend.repositories.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;

@Repository
@Transactional
public class UserRepositoryJpa implements UserRepository {

    @Autowired
    private EntityManager em;

    @Autowired
    private TeamRepository teamRepository;

    @Override
    public List<User> findAll() {
        TypedQuery<User> query = this.em.createQuery("select s from User s", User.class);

        return query.getResultList();
    }

    @Override
    public User findById(long id) {
        return em.find(User.class, id);
    }

    @Override
    public User save(User user) {

        if (user.getTeamId() > 0) user.setTeam(teamRepository.findById(user.getTeamId()));
        else user.setTeam(null);

        return em.merge(user);
    }

    @Override
    public User postUser(User user) {
        if (user.getTeamId() > 0) user.setTeam(teamRepository.findById(user.getTeamId()));
        else user.setTeam(null);

        return em.merge(user);
    }

    @Override
    public List<User> findAllNoTeam() {
        TypedQuery<User> query = this.em.createQuery("select s from User s where s.team IS null", User.class);
        return query.getResultList();
    }

    @Override
    public User deleteById(long id) {
        User toRemove = em.find(User.class, id);

        em.remove(toRemove);

        return toRemove;
    }

    @Override
    public User getUserByEmailAndPassword(String email, String password) {
        TypedQuery<User> query = this.em.createQuery("select s from User s", User.class);

        for (User user : query.getResultList()) {
            if (Objects.equals(user.getEmail(), email) && Objects.equals(user.getPassword(), password)) {
                return user;
            }
        }

        return null;
    }
}
