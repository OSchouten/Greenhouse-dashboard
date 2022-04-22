package ccu.four.backend.repositories.tokenRepository;


import ccu.four.backend.models.RegistrationToken;

public interface TokenRepository {
    RegistrationToken findById(String token);

    RegistrationToken save(RegistrationToken registrationToken);

    RegistrationToken deleteById(String token);

    RegistrationToken findLast();

    RegistrationToken getToken(String token);

    void sendEmail(String email, RegistrationToken registrationToken);
}
