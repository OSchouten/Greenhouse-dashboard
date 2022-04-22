package ccu.four.backend.repositories.tokenRepository;

import ccu.four.backend.models.RegistrationToken;
import ccu.four.backend.services.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.Objects;

@Repository
@Transactional
public class TokenRepositoryJpa implements TokenRepository {

    @Autowired
    private EntityManager em;

    @Autowired
    private EmailSenderService emailSenderService;


    @Override
    public RegistrationToken findById(String token) {
        return em.find(RegistrationToken.class, token);
    }

    @Override
    public RegistrationToken save(RegistrationToken registrationToken) {
        return em.merge(registrationToken);
    }

    @Override
    public RegistrationToken deleteById(String token) {
        RegistrationToken tokenToRemove = findById(token);
        em.remove(tokenToRemove);
        return tokenToRemove;

    }

    @Override
    public RegistrationToken findLast() {
        TypedQuery<RegistrationToken> query = em.createNamedQuery("find_latest_entry", RegistrationToken.class);
        query.setMaxResults(1);
        return query.getSingleResult();
    }


    @Override
    public RegistrationToken getToken(String token) {
        TypedQuery<RegistrationToken> query = this.em.createQuery("select s from RegistrationToken s", RegistrationToken.class);

        for (RegistrationToken registrationToken : query.getResultList()) {
            if (Objects.equals(registrationToken.getTokenString(), token)) {
                return registrationToken;
            }
        }

        return null;
    }

    @Override
    public void sendEmail(String email, RegistrationToken registrationToken) {
        emailSenderService.sendEmail(email, String.valueOf(registrationToken.getTokenString()), "Registration Token!");
    }


}