package ccu.four.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JWTConfig {
    @Value("${jwt.issuer:MyOrganisation}")
    public String issuer;

    @Value("${jwt.pass-phrase}")
    public String passphrase;

    @Value("${jwt.expiration-seconds}")
    public int expiration;
}
