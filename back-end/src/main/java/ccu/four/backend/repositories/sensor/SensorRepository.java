package ccu.four.backend.repositories.sensor;

import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.SensorHistory;
import ccu.four.backend.models.Team;

import java.util.List;

public interface SensorRepository {
    @Deprecated
    List<SensorHistory> findHistory(String history);

    List<Sensor> findAll();

    Sensor findByTypeAndTeam(String sensorType, Team team);

    Sensor findByTypeAndTeam(String sensorType, long teamId);

    Sensor save(Sensor sensor);

    void update(Sensor sensor);

    boolean deleteByTypeAndTeam(String sensorType, Team team);

    boolean deleteByTypeAndTeam(String sensorType, long teamId);

    boolean delete(Sensor sensor);

    List findByNativeQuery(String jpqlName, Object... params);

    void addByNativeQuery(String jpqlName, Object... params);

    List findSensorByNativeQuery(String jpqlName, Object... params);

    public Sensor findBySurrogateKey(String identifier);
}
