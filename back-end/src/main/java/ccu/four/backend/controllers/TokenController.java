package ccu.four.backend.controllers;

import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.RegistrationToken;
import ccu.four.backend.repositories.tokenRepository.TokenRepositoryJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("token")
public class TokenController {

    @Autowired
    private TokenRepositoryJpa tokenRepositoryJpa;

    @PostMapping("")
    public ResponseEntity<RegistrationToken> addNewToken(@RequestBody String email) {
        RegistrationToken registrationToken = new RegistrationToken();
        tokenRepositoryJpa.save(registrationToken);
        RegistrationToken lastToken = tokenRepositoryJpa.findLast();
        tokenRepositoryJpa.sendEmail(email, lastToken);
        return ResponseEntity.ok(registrationToken);
    }

    @GetMapping("/{token}")
    public ResponseEntity<RegistrationToken> getToken(@PathVariable String token) {
        RegistrationToken registrationToken = tokenRepositoryJpa.getToken(token);

        if (registrationToken == null) {
            throw new ResourceNotFound("id: " + token);
        }

        return ResponseEntity.ok(registrationToken);
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<RegistrationToken> deleteTokenById(@PathVariable String token) {
        System.out.println("TOKEN: " + token);
        // Throw exception if token doesn't exist.
        if (token == null) {
            throw new ResourceNotFound("token: " + token);
        }

        RegistrationToken registrationTokenToken = tokenRepositoryJpa.deleteById(token);

        return ResponseEntity.ok(registrationTokenToken);
    }


}
