package ccu.four.backend.services;

import ccu.four.backend.configuration.DateConfig;
import ccu.four.backend.configuration.SerializerConfig;
import ccu.four.backend.enums.SensorTypes;
import ccu.four.backend.exceptions.InternalServerErrorException;
import ccu.four.backend.exceptions.PreConditionFailed;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.SensorHistory;
import ccu.four.backend.models.Team;
import ccu.four.backend.repositories.sensor.SensorRepository;
import ccu.four.backend.repositories.team.TeamRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ValueNode;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ClientHttpRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class GreenhouseService {

    private final WebClient webClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SensorRepository sensorRepository;

    @Autowired
    private TeamRepository teamRepository;

    public GreenhouseService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://www.sneltec.com/hva").build();
    }

    @Scheduled(cron = "0 0/1 * * * ?")
    @Transactional
    protected void updateAllEntries() {
        List<Team> teams = teamRepository.findAll();
        teams.forEach(o -> {
            try {
                getSensorDataByTeamId(o.getId());
            } catch (PreConditionFailed e) {
            }
        });
    }

    public ObjectNode getHistoryFromTeam(long teamId) throws NotFoundException {
        return getHistoryFromTeam(teamId, 100);
    }

    public ObjectNode getHistoryFromTeam(long teamId, int limit) throws NotFoundException {
        Team team = teamRepository.findById(teamId);
        ObjectNode node = objectMapper.createObjectNode();
        team.getSensors().forEach(sensor -> {
            ObjectNode sensorNode = node.putObject(sensor.getSensorType());
            sensorNode.set("values", objectMapper.valueToTree(sensorRepository.findByNativeQuery("sensor_values", sensor.getIdentifier(), limit)));
            sensorNode.set("targets", objectMapper.valueToTree(sensorRepository.findByNativeQuery("sensor_targets", sensor.getIdentifier(), limit)));

        });
        return node;
    }

    /**
     * In case we want to dynamically add sensors at some point.
     *
     * @param sensorMap A map containing the sensor name and the sensor value. Sensor value can be of type String, Integer or Double.
     */
    public void updateSensorDataOfGreenhouse(int gh_id, ObjectNode sensorMap) {
        JsonNode userNode = sensorMap.get("user_id");
        if (userNode == null) throw new PreConditionFailed("No user_id was passed in the body.");
        if (!userNode.isTextual()) throw new PreConditionFailed("user_id should be string.");

        // Build the body by making a form entry for every attribute.
        BodyInserters.FormInserter<String> body = null;
        Iterator<Map.Entry<String, JsonNode>> it = sensorMap.fields();

        List<String> presentSensors = new ArrayList<>();

        // Iterate through the sensor entries and add them to the body.
        while (it.hasNext()) {
            Map.Entry<String, JsonNode> entry = it.next();
            if (body == null) body = BodyInserters.fromFormData(entry.getKey(), entry.getValue().asText());
            else body.with(entry.getKey(), entry.getValue().asText());
            presentSensors.add(entry.getKey());
        }

        if (body == null) throw new PreConditionFailed("No sensor values are present.");

        try {
            Team team = teamRepository.findById(gh_id);
            List<Sensor> sensors = team.getSensors();
            for (Sensor sensor : sensors) {
                if (!presentSensors.contains(sensor.getSensorType())) {
                    if (sensor.getTargetValues().size() > 0) {
                        Object object = SerializerConfig.deserializeSingleValueString(sensor.getLatestValue().getValue());
                        body.with(sensor.getSensorType(), object + "");

                        ValueNode node;
                        if (object instanceof Integer)
                            node = objectMapper.getNodeFactory().numberNode((Integer) object);
                        else if (object instanceof Double)
                            node = objectMapper.getNodeFactory().numberNode((Double) object);
                        else if (object instanceof String)
                            node = objectMapper.getNodeFactory().textNode((String) object);
                        else throw new InternalServerErrorException();

                        sensorMap.put(sensor.getSensorType(), node);
                    } else if (sensor.getValues().size() > 0) {
                        Object object = SerializerConfig.deserializeSingleValueString(sensor.getLatestValue().getValue());
                        body.with(sensor.getSensorType(), object + "");

                        ValueNode node;
                        if (object instanceof Integer)
                            node = objectMapper.getNodeFactory().numberNode((Integer) object);
                        else if (object instanceof Double)
                            node = objectMapper.getNodeFactory().numberNode((Double) object);
                        else if (object instanceof String)
                            node = objectMapper.getNodeFactory().textNode((String) object);
                        else throw new InternalServerErrorException();
                        sensorMap.put(sensor.getSensorType(), node);
                    } else {
                        body.with(sensor.getSensorType(), "0");
                        sensorMap.put(sensor.getSensorType(), 0);
                    }
                }
            }
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException();
        }
        saveSensorData(sensorMap, true);
        updateSensorDataOfGreenhouseWithCustomBody(gh_id, body, MediaType.APPLICATION_FORM_URLENCODED);
    }

    @Transactional
    protected void getSensorDataByTeamId(long gh_id) {
        String json = getSensorDataJsonFromTeamId(gh_id);

        JsonNode sensorsNode;
        try {
            JsonNode node = objectMapper.readTree(json);
            JsonNode errorNode = node.get("errorList");
            sensorsNode = node.get("sensorInfoList");

            // Check whether the expected response has been received.
            if (!errorNode.isArray() && !sensorsNode.isArray()) throw new InternalServerErrorException();

            // Check whether there are any errors.
            if (errorNode.isArray()) {
                String[] error = objectMapper.treeToValue(errorNode, String[].class);
                if (error.length > 0) throw new PreConditionFailed(error[0]);
            }

            for (JsonNode jsonNode : sensorsNode) {
                ObjectNode objectNode = (ObjectNode) jsonNode;

                SimpleDateFormat sdfJson = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                sdfJson.setTimeZone(TimeZone.getTimeZone(DateConfig.EST_ZONE));
                Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(DateConfig.EST_ZONE));
                calendar.setTime(sdfJson.parse(objectNode.get("date_time").asText()));
                objectNode.remove("date_time");

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                sdf.setTimeZone(TimeZone.getTimeZone(DateConfig.UTC));

                objectNode.put("date_time", sdf.format(calendar.getTime()));
            }
            saveSensorData((ArrayNode) sensorsNode);
        } catch (JsonProcessingException | ParseException e) {
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    private String getSensorDataJsonFromTeamId(long teamId) {
        return this.webClient.get()
                .uri("/v2.php?gh_id={gh_id}", teamId)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    private void updateSensorDataOfGreenhouseWithCustomBody(int gh_id, BodyInserter<?, ? super ClientHttpRequest> body, MediaType mediaType) {
        String jsonResponse = this.webClient.post()
                .uri("/v2.php?gh_id={gh_id}", gh_id)
                .contentType(mediaType)
                .body(body)
                .exchangeToMono(clientResponse -> {
                    if (clientResponse.statusCode().equals(HttpStatus.OK))
                        return clientResponse.bodyToMono(String.class);
                    else throw new InternalServerErrorException();
                })
                .block();

        try {
            JsonNode node = this.objectMapper.readTree(jsonResponse);
            String[] errors = this.objectMapper.treeToValue(node.get("errorList"), String[].class);
            if (errors.length > 0) throw new InternalServerErrorException(errors[0]);
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    private void saveSensorData(ArrayNode node) {
        saveSensorData(node, false);
    }

    private void saveSensorData(ArrayNode node, boolean isTarget) {
        for (JsonNode jsonNode : node) {
            saveSensorData((ObjectNode) jsonNode, isTarget);
        }
    }

    private void saveSensorData(ObjectNode objectNode, boolean isTarget) {
        objectNode = objectNode.deepCopy();
        int gh_id = objectNode.get("gh_id").asInt();
        Date time = objectMapper.convertValue(objectNode.get("date_time"), Date.class);
        objectNode.remove("gh_id");
        objectNode.remove("date_time");
        objectNode.remove("user_id");

        if (time == null) time = new Date();

        Team team;
        team = teamRepository.findById(gh_id);

        Iterator<Map.Entry<String, JsonNode>> it = objectNode.fields();
        while (it.hasNext()) {
            Map.Entry<String, JsonNode> entry = it.next();
            try {
                addSensorDataToTeam(team, entry, time, isTarget);
            } catch (JsonProcessingException e) {
                // Do nothing. idc
            }
        }
    }

    private void saveSensorData(String json) {
        saveSensorData(json, false);
    }

    private void saveSensorData(String json, boolean isTarget) {
        JsonNode node;
        ArrayNode sensorsNode;
        try {
            node = objectMapper.readTree(json);
            sensorsNode = (ArrayNode) node.get("sensorInfoList");
        } catch (JsonProcessingException e) {
            // TODO: Think of how to handle exceptions here.
            return;
        }
        saveSensorData(sensorsNode, isTarget);
    }

    private void addSensorDataToTeam(Team team, Map.Entry<String, JsonNode> entry, Date time, boolean isTarget) throws JsonProcessingException {
        for (Sensor sensor : team.getSensors()) {
            if (sensor.getSensorType().equals(entry.getKey())) {
                if (isTarget) {
                    sensorRepository.addByNativeQuery(
                            "add_sensor_target",
                            sensor.getIdentifier(),
                            objectMapper.writeValueAsString(entry.getValue()),
                            time
                    );
                } else {
                    sensorRepository.addByNativeQuery(
                            "add_sensor_value",
                            sensor.getIdentifier(),
                            objectMapper.writeValueAsString(entry.getValue()),
                            time
                    );
                }
                sensorRepository.update(sensor);
                return;
            }
        }

        Sensor sensor = new Sensor(entry.getKey(), team);
        for (SensorTypes type : SensorTypes.values()) {
            if (entry.getKey().equals(type.getIdentifier())) {
                sensor = type.getSensor();
                sensor.setTeam(team);
                break;
            }
        }
        if (isTarget) sensor.getTargetValues().put(time, objectMapper.writeValueAsString(entry.getValue()));
        else sensor.getValues().put(time, objectMapper.writeValueAsString(entry.getValue()));
        sensorRepository.save(sensor);
    }

    /**
     * Update the sensor values of the greenhouse.
     *
     * @param sensorData The sensor values to change to.
     * @return The sensor values that were passed as an argument.
     * @deprecated
     */
    public SensorHistory updateSensorDataOfGreenhouse(SensorHistory sensorData) {
        updateSensorDataOfGreenhouseWithCustomBody(sensorData.getGh_id(), bodyBuilder(sensorData), MediaType.APPLICATION_FORM_URLENCODED);
        return sensorData;
    }

    /**
     * Retrieve current sensor data of the given greenhouse.
     *
     * @param gh_id The ID of the greenhouse.
     * @return An object containing the sensor history.
     * @deprecated
     */
    public List<SensorHistory> getSensorHistoryByGreenhouseId(int gh_id) {
        String json = getSensorDataJsonFromTeamId(gh_id);
        saveSensorData(json);
        try {
            return Arrays.asList(objectMapper.readValue(json, SensorHistory[].class));
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    /**
     * @param sensorData Sensor data
     * @return A body to be passed to the WebClient.
     * @deprecated
     */
    private BodyInserters.FormInserter<String> bodyBuilder(SensorHistory sensorData) {
        BodyInserters.FormInserter<String> body = BodyInserters.fromFormData("gh_id", sensorData.getGh_id() + "")
                .with("user_id", sensorData.getUser_id());
        if (sensorData.getAir_temp_c() != 0d) body.with("air_temp_c", sensorData.getAir_temp_c() + "");
        if (sensorData.getAir_humidity() != 0d) body.with("air_humidity", sensorData.getAir_humidity() + "");
        if (sensorData.getSoil_temp_c() != 0d) body.with("soil_temp_c", sensorData.getSoil_temp_c() + "");
        if (sensorData.getSoil_humidity() != 0d) body.with("soil_humidity", sensorData.getSoil_humidity() + "");
        if (sensorData.getSoil_mix_id() != 0) body.with("soil_mix_id", sensorData.getSoil_mix_id() + "");
        if (sensorData.getWater_ph() != 0d) body.with("water_ph", sensorData.getWater_ph() + "");
        if (sensorData.getWater_mix_id() != 0) body.with("water_mix_id", sensorData.getWater_mix_id() + "");
        if (sensorData.getLighting_rgb() != null) body.with("lighting_rgb", sensorData.getLighting_rgb());
        if (sensorData.getDaily_exposure() != 0d) body.with("daily_exposure", sensorData.getDaily_exposure() + "");
        return body;
    }
}
