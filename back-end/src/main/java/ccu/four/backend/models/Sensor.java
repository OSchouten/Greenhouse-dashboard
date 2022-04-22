package ccu.four.backend.models;

import ccu.four.backend.enums.Measures;
import ccu.four.backend.models.note.SensorNote;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import java.util.*;

@Entity
@NamedNativeQueries({
        @NamedNativeQuery(
                name = "sensor_values",
                query = "SELECT DISTINCT v.time as date, v.value FROM sensor s JOIN sensor_values v ON v.sensor_identifier = ?1 ORDER BY v.time DESC LIMIT ?2"
        ),
        @NamedNativeQuery(
                name = "sensor_targets",
                query = "SELECT DISTINCT v.time as date, v.value FROM sensor s JOIN sensor_target_values v ON v.sensor_identifier = ?1 ORDER BY v.time DESC LIMIT ?2"
        ),
        @NamedNativeQuery(
                name = "add_sensor_value",
                query = "INSERT INTO sensor_values (sensor_identifier, value, time) VALUES (?1, ?2, ?3)"
        ),
        @NamedNativeQuery(
                name = "add_sensor_target",
                query = "INSERT INTO sensor_target_values (sensor_identifier, value, time) VALUES (?1, ?2, ?3)"
        ),
        @NamedNativeQuery(
                name = "getInitialSensors",
                query = "SELECT * FROM sensor where team_id = ?"
        )
})
public class Sensor {

    @Id
    private String identifier;
    private int idx;
    private String sensorType;
    private double minValue;
    private double maxValue;
    private Measures unit;
    private String readableName;
    private String description;
    private Double step;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "sensor_values")    // Table and foreign key name
    @MapKeyColumn(name = "time")                // Column name for the Date type.
    @Column(name = "value")                     // Column name for the Double type.
    @JsonIgnore
    private Map<Date, String> values = new LinkedHashMap<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "sensor_target_values")  // Table and foreign key name
    @MapKeyColumn(name = "time")                    // Column name for the Date type.
    @Column(name = "value")                         // Column name for the Double type.
    @JsonIgnore
    private Map<Date, String> targetValues = new LinkedHashMap<>();

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teamId")
    private Team team;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sensor")

    private List<SensorNote> notes;

    public Sensor() {
        this.identifier = buildId("null", 0);
    }

    public Sensor(@NotNull Sensor sensor) {
        this(sensor.idx, sensor.sensorType, sensor.minValue, sensor.maxValue, sensor.unit, sensor.readableName, sensor.description, new HashMap<>(sensor.values), new HashMap<>(sensor.targetValues), sensor.step, null);
    }

    public Sensor(int idx, String sensorType, double minValue, double maxValue, Measures unit, String readableName, String description, Map<Date, String> values, Map<Date, String> targetValues, Double step, Team team) {
        this.idx = idx;
        this.sensorType = sensorType;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.unit = unit;
        this.readableName = readableName;
        this.description = description;
        this.values = values;
        this.targetValues = targetValues;
        this.team = team;
        this.step = step;
    }

    public Sensor(int idx, String sensorType, double minValue, double maxValue, Measures unit, String readableName, String description, Double step, Team team) {
        this(idx, sensorType, minValue, maxValue, unit, readableName, description, new HashMap<>(), new HashMap<>(), step, team);
    }

    public Sensor(String sensorType, Team team) {
        this.identifier = buildId(sensorType, team);
        this.sensorType = sensorType;
        this.team = team;
    }

    public static String buildId(String sensorType, long teamId) {
        return sensorType + teamId;
    }

    public static String buildId(String sensorType, Team team) {
        return buildId(sensorType, team.getId());
    }

    public void addTarget(Map.Entry<Date, String> entry) {
        addTarget(entry.getKey(), entry.getValue());
    }

    public void addValue(Map.Entry<Date, String> entry) {
        addValue(entry.getKey(), entry.getValue());
    }

    public void addTarget(Date date, String value) {
        targetValues.put(date, value);
    }

    public void addValue(Date date, String value) {
        values.put(date, value);
    }

    @JsonIgnore
    public Map.Entry<Date, String> getLatestValue() {
        return values.entrySet().stream()
                .max(Map.Entry.comparingByKey())
                .orElse(null);
    }

    @JsonIgnore
    public Map.Entry<Date, String> getLatestTarget() {
        return targetValues.entrySet().stream()
                .max(Map.Entry.comparingByKey())
                .orElse(null);
    }

    public void setIdx(int idx) {
        this.idx = idx;
    }

    public void setSensorType(String sensorType) {
        this.identifier = buildId(sensorType, team);
        this.sensorType = sensorType;
    }

    public void setMinValue(double minValue) {
        this.minValue = minValue;
    }

    public void setMaxValue(double maxValue) {
        this.maxValue = maxValue;
    }

    public void setUnit(Measures unit) {
        this.unit = unit;
    }

    public void setReadableName(String readableName) {
        this.readableName = readableName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getIdx() {
        return idx;
    }

    public String getSensorType() {
        return sensorType;
    }

    public double getMinValue() {
        return minValue;
    }

    public double getMaxValue() {
        return maxValue;
    }

    public Measures getUnit() {
        return unit;
    }

    public String getReadableName() {
        return readableName;
    }

    public String getDescription() {
        return description;
    }

    public List<SensorNote> getNotes() {
        return notes;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.identifier = buildId(this.sensorType, team);
        this.team = team;
    }

    public Map<Date, String> getValues() {
        return values;
    }

    public Map<Date, String> getTargetValues() {
        return targetValues;
    }

    public String getIdentifier() {
        return identifier;
    }
}
