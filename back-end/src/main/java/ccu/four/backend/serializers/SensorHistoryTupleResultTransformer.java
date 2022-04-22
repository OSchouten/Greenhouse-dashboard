package ccu.four.backend.serializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.hibernate.transform.ResultTransformer;

import java.util.Date;
import java.util.List;

public class SensorHistoryTupleResultTransformer implements ResultTransformer {
    @Override
    public Object transformTuple(Object[] objects, String[] strings) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("date", mapper.getDateFormat().format(new Date(((java.sql.Timestamp) objects[0]).getTime())));
        node.put("value", (String) objects[1]);
        return node;
    }

    @Override
    public List transformList(List list) {
        return list;
    }
}
