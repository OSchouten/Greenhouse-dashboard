package ccu.four.backend.models.note;

import ccu.four.backend.enums.Specialty;
import ccu.four.backend.models.Sensor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@NamedNativeQueries({
        @NamedNativeQuery(name = "sensorNotes",
                query = "SELECT * FROM sensor_note s WHERE s.sensor_identifier = ? ORDER BY s.date DESC")})
public class SensorNote extends Note {

    // TODO: Make nullable false, it's true for testing purposes.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_identifier", nullable = true)
    @JsonBackReference
    private Sensor sensor;

    private Specialty specialty;

    public SensorNote(Sensor sensor, String header, String content) {
        super(header, content);
        this.sensor = sensor;
    }

    public SensorNote(Sensor sensor) {
        this(sensor, "", "");
    }

    public SensorNote() {
        this(null, "", "");
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setSpecialty(Specialty specialty) {
        this.specialty = specialty;
    }
}
