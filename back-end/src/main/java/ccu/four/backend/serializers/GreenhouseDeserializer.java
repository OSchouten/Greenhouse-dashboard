package ccu.four.backend.serializers;

import ccu.four.backend.exceptions.InternalServerErrorException;
import ccu.four.backend.models.SensorHistory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class GreenhouseDeserializer extends StdDeserializer<SensorHistory[]> {

    public GreenhouseDeserializer() {
        this(null);
    }

    public GreenhouseDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public SensorHistory[] deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        ObjectCodec codec = jsonParser.getCodec();
        JsonNode node = codec.readTree(jsonParser);

        ObjectMapper mapper = new ObjectMapper();   // Get a clean ObjectMapper to not create an infinite loop by trying to
        // deserialize with the same method.

        String[] errors = mapper.treeToValue(node.get("errorList"), String[].class);
        if (errors.length > 0) throw new InternalServerErrorException(errors[0]);
        return mapper.treeToValue(node.get("sensorInfoList"), SensorHistory[].class);
    }
}
