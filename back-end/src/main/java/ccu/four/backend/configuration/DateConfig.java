package ccu.four.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.ZoneId;

@Configuration
public class DateConfig {
    public final static ZoneId EST_ZONE = ZoneId.of("EST", ZoneId.SHORT_IDS);
    public final static ZoneId UTC = ZoneId.of("UTC", ZoneId.SHORT_IDS);

    @Bean
    public DateFormat getDateFormat() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }
}
