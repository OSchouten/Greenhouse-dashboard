package ccu.four.backend.repositories.user;

import ccu.four.backend.models.User;

import java.util.List;

public interface UserRepository {
    List<User> findAll();

    User findById(long id);

    User save(User user);

    User deleteById(long id);

    User getUserByEmailAndPassword(String email, String password);

    User postUser(User user);

    List<User> findAllNoTeam();

}
