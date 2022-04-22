package ccu.four.backend.repositories.sensor;

import ccu.four.backend.exceptions.PreConditionFailed;
import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.SensorHistory;
import ccu.four.backend.models.Team;
import ccu.four.backend.serializers.SensorHistoryTupleResultTransformer;
import com.google.gson.*;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Repository
@Transactional
public class SensorRepositoryJpa implements SensorRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<SensorHistory> findHistory(String history) {
        List<SensorHistory> sensorHistories = new ArrayList<>();

        Gson gson = new GsonBuilder().create();
        //use gson to get the nested code as an int
        int code = gson.fromJson(history, JsonElement.class).getAsJsonObject().get("code").getAsInt();

        //use gson to get the nested msg json as a string
        String result = gson.fromJson(history, JsonElement.class).getAsJsonObject().get("msg").getAsString();

        if (code != 0) {
            throw new PreConditionFailed(result);
        }

        //parse the string into a Json Array
        JsonArray jsonArray = gson.fromJson(result, JsonArray.class);
        //parse the Json array into a JsonObject to get the values and put them in the list
        jsonArray.forEach(
                message -> {
                    JsonObject msg = message.getAsJsonObject();
                    sensorHistories.add(new SensorHistory(msg.get("date_time").getAsString(), msg.get("user_id").getAsString(),
                            msg.get("gh_id").getAsInt(), msg.get("air_temp_c").getAsDouble(), msg.get("air_humidity").getAsDouble(),
                            msg.get("soil_temp_c").getAsDouble(), msg.get("soil_humidity").getAsDouble(), msg.get("soil_mix_id").getAsInt(),
                            msg.get("water_ph").getAsDouble(), msg.get("water_mix_id").getAsInt(), msg.get("lighting_rgb").getAsString(),
                            msg.get("daily_exposure").getAsDouble(), msg.get("CO2_level").getAsDouble()));
                }
        );
        return sensorHistories;
    }

    @Override
    public List<Sensor> findAll() {
        return em.createQuery("SELECT s FROM Sensor s").getResultList();
    }

    @Override
    public Sensor findByTypeAndTeam(String sensorType, Team team) {
        return findBySurrogateKey(Sensor.buildId(sensorType, team));
    }

    @Override
    public Sensor findByTypeAndTeam(String sensorType, long teamId) {
        return findBySurrogateKey(Sensor.buildId(sensorType, teamId));
    }

    @Override
    public Sensor save(Sensor sensor) {
        em.persist(sensor);
        return sensor;
    }

    @Override
    public void update(Sensor sensor) {
        if (findByTypeAndTeam(sensor.getSensorType(), sensor.getTeam()) != null) {
            em.merge(sensor);
        } else throw new ResourceNotFound("Couldn't find sensor with given ID.");
    }

    @Override
    public boolean deleteByTypeAndTeam(String sensorType, Team team) {
        return deleteByTypeAndTeam(sensorType, team.getId());
    }

    @Override
    public boolean deleteByTypeAndTeam(String sensorType, long teamId) {
        Sensor sensor = em.find(Sensor.class, Sensor.buildId(sensorType, teamId));
        return this.delete(sensor);
    }

    @Override
    public boolean delete(Sensor sensor) {
        em.remove(sensor);
        return true;
    }

    public List findByNativeQuery(String jpqlName, Object... params) {
        Query query = em.createNamedQuery(jpqlName);
        for (int i = 0; i < params.length; i++) query.setParameter(i + 1, params[i]);
        return query.unwrap(org.hibernate.query.Query.class).setResultTransformer(new SensorHistoryTupleResultTransformer()).getResultList();
    }

    @Override
    public void addByNativeQuery(String jpqlName, Object... params) {
        Query query = em.createNamedQuery(jpqlName);
        for (int i = 0; i < params.length; i++) query.setParameter(i + 1, params[i]);
        query.executeUpdate();
    }

    public List findSensorByNativeQuery(String jpqlName, Object... params) {
        Query query = em.createNamedQuery(jpqlName);
        for (int i = 0; i < params.length; i++) query.setParameter(i + 1, params[i]);
        return query.getResultList();
    }

    @Override
    public Sensor findBySurrogateKey(String identifier) {
        return em.find(Sensor.class, identifier);
    }
}
