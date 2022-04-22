package ccu.four.backend.controllers;

import ccu.four.backend.exceptions.PreConditionFailed;
import ccu.four.backend.exceptions.ResourceNotFound;
import ccu.four.backend.models.Sensor;
import ccu.four.backend.models.SensorHistory;
import ccu.four.backend.models.note.SensorNote;
import ccu.four.backend.repositories.sensor.SensorRepository;
import ccu.four.backend.repositories.team.TeamRepository;
import ccu.four.backend.services.GreenhouseService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Objects;


// TODO: Maybe use request mapping for the class itself as well.
//      I didn't change it to prevent messing up front-end.
@RestController
public class SensorController {

    final private int DEFAULT_HISTORY_LIMIT = 100;

    @Autowired
    SensorRepository sensorRepository;

    @Autowired
    GreenhouseService greenhouseService;

    @Autowired
    TeamRepository teamRepository;

    @GetMapping("/")
    public String isInitialized() {
        return "Status OK, repository has been initialized.";
    }

    /**
     * @deprecated This method fills a class, not allowing for adding sensors throughout production.
     * It is replaced by {@code getSensorData(int gh_id)} which works as a proxy that doesn't
     * alter the response from the greenhouse.
     */
    @GetMapping("/sensorHistory/{gh_id}")
    @Deprecated
    public List<SensorHistory> getSensorsHistory(@PathVariable int gh_id) {
        return greenhouseService.getSensorHistoryByGreenhouseId(gh_id);
    }

    /**
     * @param teamId The ID of the greenhouse.
     * @return An ArrayNode, that will be converted to JSON, containing the response from the greenhouse.
     */
    @GetMapping("proxy/team/{teamId}/sensors")
    public ObjectNode getSensorData(
            @PathVariable long teamId,
            @RequestParam(required = false) Integer limit
    ) {
        try {
            if (limit != null) return greenhouseService.getHistoryFromTeam(teamId, limit);
            return greenhouseService.getHistoryFromTeam(teamId);
        } catch (NotFoundException e) {
            throw new ResourceNotFound("Couldn't find team with given ID.");
        }
    }

    @GetMapping("/team/{teamId}/sensor/{sensorType}/history")
    public ObjectNode getSensorHistory(
            @PathVariable long teamId,
            @PathVariable String sensorType,
            @RequestParam(required = false) Integer limit
    ) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode objectNode = mapper.createObjectNode();
        objectNode.putArray("values");
        objectNode.putArray("targetValues");
        ArrayNode valuesNode = (ArrayNode) objectNode.get("values");
        ArrayNode targetsNode = (ArrayNode) objectNode.get("targetValues");
        valuesNode.addAll(getSensorValueHistory(teamId, sensorType, limit));
        targetsNode.addAll(getSensorTargetHistory(teamId, sensorType, limit));
        return objectNode;
    }

    @GetMapping("/team/{teamId}/sensor/{sensorType}/history/value")
    public List getSensorValueHistory(
            @PathVariable long teamId,
            @PathVariable String sensorType,
            @RequestParam(required = false) Integer limit
    ) {
        Sensor sensor = getSensor(sensorType, teamId);
        return sensorRepository.findByNativeQuery("sensor_values", sensor.getIdentifier(), Objects.requireNonNullElse(limit, DEFAULT_HISTORY_LIMIT));
    }

    @GetMapping("/team/{teamId}/sensor/{sensorType}/history/target")
    public List getSensorTargetHistory(
            @PathVariable long teamId,
            @PathVariable String sensorType,
            @RequestParam(required = false) Integer limit
    ) {
        Sensor sensor = getSensor(sensorType, teamId);
        return sensorRepository.findByNativeQuery("sensor_targets", sensor.getIdentifier(), Objects.requireNonNullElse(limit, DEFAULT_HISTORY_LIMIT));

    }

    /**
     * Updates the greenhouse dynamically. If sensors are added in the future they can also be passed to this method.
     * This method serves as a proxy with minimal checks; checking whether a gh_id and user_id is present.
     *
     * @param gh_id  The ID of the greenhouse.
     * @param values An ObjectNode that holds the received JSON and passes all the attributes as parameters.
     *               Attributes can be of any type and have any name, not dependent on SensorHistory.
     * @return A response entity wrapping the values from the body.
     */
    @PostMapping("/team/{gh_id}/sensors")
    public ResponseEntity<ObjectNode> updateSensorValues(@PathVariable int gh_id, @RequestBody ObjectNode values) {
        JsonNode ghNode = values.get("gh_id");
        if (ghNode != null) {
            if (!ghNode.isInt()) throw new PreConditionFailed("The greenhouse ID in the body is not a number.");
            if (ghNode.asInt() != gh_id)
                throw new PreConditionFailed("The greenhouse ID in the body does not match the path parameter.");
        }
        greenhouseService.updateSensorDataOfGreenhouse(gh_id, values);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.created(uri).body(values);
    }

    /**
     * @param teamId The ID of the greenhouse.
     * @return An ArrayNode, that will be converted to JSON, containing the response from the greenhouse.
     */
    @GetMapping("team/{teamId}/sensorValues")
    public ObjectNode getSensorValuesData(
            @PathVariable long teamId,
            @RequestParam(required = false) Integer limit
    ) {
        try {
            if (limit != null) return greenhouseService.getHistoryFromTeam(teamId, limit);
            return greenhouseService.getHistoryFromTeam(teamId);
        } catch (NotFoundException e) {
            throw new ResourceNotFound("Couldn't find team with given ID.");
        }
    }


    @Deprecated
    @GetMapping("/getAllSensors")
    public List<Sensor> getAllTeams() {
        return sensorRepository.findAll();
    }

    @GetMapping("/team/{teamId}/sensor/{sensorType}")
    public ObjectNode getSensor(
            @PathVariable String sensorType,
            @PathVariable long teamId,
            @RequestParam(required = false) Integer limit
    ) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = (ObjectNode) mapper.valueToTree(sensorRepository.findByTypeAndTeam(sensorType, teamId));
        node.putArray("values").addAll(getSensorValueHistory(teamId, sensorType, limit));
        node.putArray("targets").addAll(getSensorTargetHistory(teamId, sensorType, limit));
        return node;
    }

    private Sensor getSensor(
            @PathVariable String sensorType,
            @PathVariable long teamId
    ) {
        return sensorRepository.findByTypeAndTeam(sensorType, teamId);
    }

    @DeleteMapping("/team/{teamId}/sensor/{sensorType}")
    public boolean deleteSensor(@PathVariable long teamId, @PathVariable String sensorType) {
        return sensorRepository.deleteByTypeAndTeam(sensorType, teamId);
    }

    @PostMapping("/saveSensor")
    public ResponseEntity<Sensor> postAEvents(@RequestBody Sensor sensor) {
        Sensor savedSensor = sensorRepository.save(sensor);
        URI URI = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(sensor.getIdx()).toUri();
        return ResponseEntity.created(URI).body(savedSensor);
    }


    @PutMapping("team/{teamId}/sensor/{sensorType}")
    public void putSensor(@RequestBody Sensor sensor, @PathVariable long teamId, @PathVariable String sensorType) {
        if (sensor.getSensorType() == null) sensor.setSensorType(sensorType);

        if (sensor.getTeam() == null) sensor.setTeam(teamRepository.findById(teamId));

        if (!sensor.getSensorType().equals(sensorType))
            throw new PreConditionFailed("Sensor Type not equal to given Sensor.");
        if (sensor.getTeam().getId() != teamId) throw new PreConditionFailed("Team ID doesn't match team.");
        sensorRepository.update(sensor);
    }

    @GetMapping("sensor/notes")
    public List<SensorNote> getAllNotes(@RequestBody Sensor sensorReq) {
        Sensor sensor = sensorRepository.findByTypeAndTeam(sensorReq.getSensorType(), sensorReq.getTeam());
        if (sensor == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Couldn't find a sensor by the given id.");
        return sensor.getNotes();
    }

    @GetMapping("sensor/initial/{teamId}")
    public List<Sensor> get(@PathVariable long teamId) {
        List<Sensor> sensorList = sensorRepository.findSensorByNativeQuery("getInitialSensors", teamId);
        if (sensorList == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Couldn't find sensors by the given team id.");
        return sensorList;
    }
}

