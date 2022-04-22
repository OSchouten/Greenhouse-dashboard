package ccu.four.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

@Component
public class JWTRequestFilter extends OncePerRequestFilter {
    // Path prefixes that will be protected by the authentication filter.
    private static final Set<String> SECURED_PATHS = Set.of("/team", "/sensor", "/note", "/users", "/getAllSensors");

    @Autowired
    private JWTConfig jwtConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String servletPath = request.getServletPath();

        // OPTIONS request and non-secured area should pass through without check.
        if (HttpMethod.OPTIONS.matches(request.getMethod()) ||
                JWTRequestFilter.SECURED_PATHS.stream().noneMatch(servletPath::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get the encrypted token string from the authorization request header.
        String encryptedToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Block the request if no token was found.
        if (encryptedToken == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No token provided. You need to login first.");
            return;
        }

        // Decode the encoded and signed token, after removing optional Bearer prefix.
        JWTokenUtils tokenInfo = null;

        try {
            tokenInfo = JWTokenUtils.decode(encryptedToken.replace("Bearer ", ""), jwtConfig.passphrase);
        } catch (RuntimeException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage() + " You need to login first.");
            return;
        }

        // Pass-on the token info as an attribute for the request.
        request.setAttribute(JWTokenUtils.KEY, tokenInfo);

        filterChain.doFilter(request, response);
    }
}
