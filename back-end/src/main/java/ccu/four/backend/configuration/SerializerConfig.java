package ccu.four.backend.configuration;

import ccu.four.backend.models.SensorHistory;
import ccu.four.backend.serializers.GreenhouseDeserializer;
import ccu.four.backend.serializers.GreenhouseSerializer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SerializerConfig {
    @Bean
    public ObjectMapper getObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(getGreenhouseDeserializerModule());
        objectMapper.registerModule(getGreenhouseSerializerModule());
        return objectMapper;
    }

    private SimpleModule getGreenhouseDeserializerModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(SensorHistory[].class, new GreenhouseDeserializer());
        return module;
    }

    private SimpleModule getGreenhouseSerializerModule() {
        SimpleModule module = new SimpleModule();
        module.addSerializer(SensorHistory.class, new GreenhouseSerializer());
        return module;
    }

    public static Object deserializeSingleValueString(String json) throws JsonProcessingException {
        try {
            return Integer.parseInt(json);
        } catch (NumberFormatException e1) {
            try {
                return Double.parseDouble(json);
            } catch (NumberFormatException e2) {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(json, String.class);
            } catch (NullPointerException e2) {
                return null;
            }

        }


    }
}
