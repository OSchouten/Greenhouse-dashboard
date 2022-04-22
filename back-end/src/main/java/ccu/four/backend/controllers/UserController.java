package ccu.four.backend.controllers;

import ccu.four.backend.exceptions.PreConditionFailed;
import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Team;
import ccu.four.backend.models.User;
import ccu.four.backend.repositories.user.UserRepository;
import ccu.four.backend.security.JWTConfig;
import ccu.four.backend.security.JWTokenUtils;
import ccu.four.backend.security.PasswordEncoder;
import ccu.four.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class UserController implements WebMvcConfigurer {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JWTConfig jwtConfig;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        User user = userRepository.findById(id);

        // Throw exception if user doesn't exist.
        if (user == null) {
            throw new ResourceNotFound("id: " + id);
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/usersNoTeam")
    public List<User> getAllUsersWithoutTeam(
    ) {
        return userRepository.findAllNoTeam();
    }

    @PostMapping("/registerUser")
    public ResponseEntity<User> addNewUser(@RequestBody User user) {

        user.setPassword(encoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        // Create path for saved user.
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

        return ResponseEntity.created(location).body(savedUser);
    }


    @PostMapping("/userPost")
    public ResponseEntity<User> postUser(@RequestBody User user) {
        User savedUser = userRepository.postUser(user);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

        return ResponseEntity.created(location).body(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable long id) {
        // Throw exception if the id's don't match.
        if (user.getId() != id) {
            throw new PreConditionFailed("id: " + id + " - user.getId: " + user.getId());
        }

        User savedUser = userRepository.save(user);

        // Create path for updated user.
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

        return ResponseEntity.created(location).body(savedUser);
    }

    @PutMapping("/users/updatePassword/{id}")
    public ResponseEntity<User> updatePassword(@RequestBody User user, @PathVariable long id) {
        // Throw exception if the id's don't match.
        if (user.getId() != id) {
            throw new PreConditionFailed("id: " + id + " - user.getId: " + user.getId());
        }

        user.setPassword(encoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        // Create path for updated user.
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

        return ResponseEntity.created(location).body(savedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<User> deleteUserById(@PathVariable long id) {
        User user = userRepository.deleteById(id);

        // Throw exception if user doesn't exist.
        if (user == null) {
            throw new ResourceNotFound("id: " + id);
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/authentication/login")
    public ResponseEntity<User> getUserByEmailAndPassword(@RequestBody ObjectNode objectNode) {
        String encodedPassword = encoder.encode(objectNode.get("password").asText());

        User user = userRepository.getUserByEmailAndPassword(objectNode.get("email").asText(), encodedPassword);

        // Throw exception if user is not found.
        if (user == null) {
            throw new ResourceNotFound("User not found.");
        }

        String fullName = user.getFirstName() + " " + user.getLastName();

        JWTokenUtils jwToken = new JWTokenUtils(fullName, user.getId(), user.getSpecialty().toString());

        String tokenString = jwToken.encode(jwtConfig.issuer, jwtConfig.passphrase, jwtConfig.expiration);

        return ResponseEntity.accepted().header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenString)
                .body(user);
    }

    @GetMapping("/users/{id}/team")
    @JsonView(Views.Minimal.class)
    public Team getUserTeamByUserId(@PathVariable long id) {
        User user = getUserById(id).getBody();
        if (user == null) throw new ResourceNotFound("Couldn't find user by id.");
        return user.getTeam();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("GET", "POST", "PUT", "DELETE")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedOrigins("https://stb-fe-ccu4-staging.herokuapp.com", "http://127.0.0.1:4200", "http://localhost:4200")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }
}
