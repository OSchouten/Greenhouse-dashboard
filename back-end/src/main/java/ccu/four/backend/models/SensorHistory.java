package ccu.four.backend.models;

import com.fasterxml.jackson.annotation.JsonSetter;

@Deprecated
public class SensorHistory {

    private String date_time;
    private String user_id;
    private int gh_id;
    private double air_temp_c;
    private double air_humidity;
    private double soil_temp_c;
    private double soil_humidity;
    private int soil_mix_id;
    private double water_ph;
    private int water_mix_id;
    private String lighting_rgb;
    private double daily_exposure;
    private double co2_level;

    public SensorHistory() {
    }

    public SensorHistory(String date_time, String user_id, int gh_id, double air_temp_c, double air_humidity,
                         double soil_temp_c, double soil_humidity, int soil_mix_id, double water_ph, int water_mix_id,
                         String lighting_rgb, double daily_exposure, double co2_level) {
        this.date_time = date_time;
        this.user_id = user_id;
        this.gh_id = gh_id;
        this.air_temp_c = air_temp_c;
        this.air_humidity = air_humidity;
        this.soil_temp_c = soil_temp_c;
        this.soil_humidity = soil_humidity;
        this.soil_mix_id = soil_mix_id;
        this.water_ph = water_ph;
        this.water_mix_id = water_mix_id;
        this.lighting_rgb = lighting_rgb;
        this.daily_exposure = daily_exposure;
        this.co2_level = co2_level;
    }

    public void setDate_time(String date_time) {
        this.date_time = date_time;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public void setGh_id(int gh_id) {
        this.gh_id = gh_id;
    }

    public void setAir_temp_c(double air_temp_c) {
        this.air_temp_c = air_temp_c;
    }

    public void setAir_humidity(double air_humidity) {
        this.air_humidity = air_humidity;
    }

    public void setSoil_temp_c(double soil_temp_c) {
        this.soil_temp_c = soil_temp_c;
    }

    public void setSoil_humidity(double soil_humidity) {
        this.soil_humidity = soil_humidity;
    }

    public void setSoil_mix_id(int soil_mix_id) {
        this.soil_mix_id = soil_mix_id;
    }

    public void setWater_ph(double water_ph) {
        this.water_ph = water_ph;
    }

    public void setWater_mix_id(int water_mix_id) {
        this.water_mix_id = water_mix_id;
    }

    public void setLighting_rgb(String lightning_rgb) {
        this.lighting_rgb = lightning_rgb;
    }

    public void setDaily_exposure(double daily_exposure) {
        this.daily_exposure = daily_exposure;
    }

    @JsonSetter("CO2_level")
    public void setCO2_level(double CO2_level) {
        this.co2_level = CO2_level;
    }

    public String getDate_time() {
        return date_time;
    }

    public String getUser_id() {
        return user_id;
    }

    public int getGh_id() {
        return gh_id;
    }

    public double getAir_temp_c() {
        return air_temp_c;
    }

    public double getAir_humidity() {
        return air_humidity;
    }

    public double getSoil_temp_c() {
        return soil_temp_c;
    }

    public double getSoil_humidity() {
        return soil_humidity;
    }

    public int getSoil_mix_id() {
        return soil_mix_id;
    }

    public double getWater_ph() {
        return water_ph;
    }

    public int getWater_mix_id() {
        return water_mix_id;
    }

    public String getLighting_rgb() {
        return lighting_rgb;
    }

    public double getDaily_exposure() {
        return daily_exposure;
    }

    public double getCO2_level() {
        return co2_level;
    }

}
