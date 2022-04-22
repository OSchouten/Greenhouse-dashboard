package ccu.four.backend.enums;

import ccu.four.backend.models.Sensor;

public enum SensorTypes {
    AIR_TEMP_C(new Sensor(1, "air_temp_c", 10, 40, Measures.TEMPERATURE, "Air Temperature", "The current temperature of the air.", 0.1, null)),
    AIR_HUMIDITY(new Sensor(2, "air_humidity", 12, 99, Measures.PERCENTAGE, "Air Humidity", "The current humidity of the air.", 0.1, null)),
    SOIL_TEMP_C(new Sensor(3, "soil_temp_c", 10, 40, Measures.TEMPERATURE, "Soil Temperature", "The current temperature of the soil.", 0.1, null)),
    SOIL_HUMIDITY(new Sensor(4, "soil_humidity", 12, 99, Measures.PERCENTAGE, "Soil Humidity", "The current humidity of the soil.", 0.1, null)),
    SOIL_MIX_ID(new Sensor(5, "soil_mix_id", 1, 10000, Measures.ID, "Soil Mix", "The current soil mixture preset.", 1d, null)),
    WATER_PH(new Sensor(6, "water_ph", 5, 8, Measures.ACIDITY, "Water pH", "The current pH of the water.", 0.1, null)),
    WATER_MIX_ID(new Sensor(7, "water_mix_id", 1, 10000, Measures.ID, "Water Mix", "The current water mixture preset.", 1d, null)),
    LIGHTING_RGB(new Sensor(8, "lighting_rgb", 0, 16777215, Measures.HEXADECIMAL, "RGB Lighting", "The current RGB colour of the lighting.", 1d, null)),
    DAILY_EXPOSURE(new Sensor(9, "daily_exposure", 1, 1200, Measures.TIME, "Daily Exposure", "The current daily exposure to growlights.", 1d, null)),
    CO2_LEVEL(new Sensor(10, "CO2_level", 0.0, 2000.0, Measures.PPM, "CO2 Level", "The current CO2 level.", 0.1, null));

    private final Sensor sensor;

    private SensorTypes(Sensor sensor) {
        this.sensor = sensor;
    }

    public Sensor getSensor() {
        return new Sensor(sensor);
    }

    public String getIdentifier() {
        return sensor.getSensorType();
    }
}
