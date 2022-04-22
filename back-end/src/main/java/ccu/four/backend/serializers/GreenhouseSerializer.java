package ccu.four.backend.serializers;

import ccu.four.backend.models.SensorHistory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class GreenhouseSerializer extends StdSerializer<SensorHistory> {
    public GreenhouseSerializer() {
        this(null);
    }

    public GreenhouseSerializer(Class<SensorHistory> t) {
        super(t);
    }

    @Override
    public void serialize(SensorHistory sensorHistory, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("gh_id", sensorHistory.getGh_id());
        jsonGenerator.writeStringField("user_id", sensorHistory.getUser_id());
        if (sensorHistory.getAir_temp_c() != 0d)
            jsonGenerator.writeNumberField("air_temp_c", sensorHistory.getAir_temp_c());
        if (sensorHistory.getAir_humidity() != 0d)
            jsonGenerator.writeNumberField("air_humidity", sensorHistory.getAir_humidity());
        if (sensorHistory.getSoil_temp_c() != 0d)
            jsonGenerator.writeNumberField("soil_temp_c", sensorHistory.getSoil_temp_c());
        if (sensorHistory.getSoil_humidity() != 0d)
            jsonGenerator.writeNumberField("soil_humidity", sensorHistory.getSoil_humidity());
        if (sensorHistory.getSoil_mix_id() != 0)
            jsonGenerator.writeNumberField("soil_mix_id", sensorHistory.getSoil_mix_id());
        if (sensorHistory.getWater_ph() != 0d) jsonGenerator.writeNumberField("water_ph", sensorHistory.getWater_ph());
        if (sensorHistory.getWater_mix_id() != 0)
            jsonGenerator.writeNumberField("water_mix_id", sensorHistory.getWater_mix_id());
        if (sensorHistory.getDaily_exposure() != 0d)
            jsonGenerator.writeNumberField("daily_exposure", sensorHistory.getDaily_exposure());
        if (sensorHistory.getLighting_rgb() != null)
            jsonGenerator.writeStringField("lighting_rgb", sensorHistory.getLighting_rgb());
        jsonGenerator.writeEndObject();
    }
}
