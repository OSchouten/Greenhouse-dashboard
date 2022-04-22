package ccu.four.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
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
