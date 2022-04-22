import {Injectable} from '@angular/core';
import {Graph} from "../../models/graph";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SensorsService} from "../sensors/sensors.service";
import {ReadableUnit, UnitNames} from "../../models/units";

@Injectable({
  providedIn: 'root'
})

export class GraphsService {
  public graphs: Graph[] = [];

  constructor(private http: HttpClient, private sensorService: SensorsService) {
  }

  public async getGraphs(teamId: number, isTargetValue: boolean, limit: number): Promise<Graph[]> {
    await this.getDataForGraphs(teamId, isTargetValue, limit);
    return this.graphs;
  }

  public addGraph(graph: Graph) {
    if (!this.graphs.includes(graph)) {
      this.graphs.push(graph);
      return true;
    } else
      return false;
  }

  public async restGetGraphData(teamNumber: number, limit: number) {
    return this.http.get(`${environment.BACKEND_URL}/team/${teamNumber}/sensorValues?limit=${limit}`).toPromise();
  }

  public async getDataForGraphs(teamNumber: number, isTargetValue: boolean, limit: number) {
    //first we empty the graph array so that there won't be any duplicates
    this.graphs = [];

    //get the data from the backend using the restGetGraphData function
    const sensorData = await this.restGetGraphData(teamNumber, limit);

    //create a map to help us with process of the data
    const sensorDataMap = new Map<string, Object>();

    //if the user wants to see target values, then we will put the target values into the map
    if (isTargetValue == true) {
      Object.keys(sensorData).forEach(sensorName => {
        sensorDataMap.set(sensorName, sensorData[sensorName]["targets"]);
      })
    } else {
      //if the user wants to see values, then we will put the values into the map
      Object.keys(sensorData).forEach(sensorName => {
        sensorDataMap.set(sensorName, sensorData[sensorName]["values"]);
      })
    }
    //use the method createGraph to transform the sensorDataMap into an graph object
    this.createGraph(sensorDataMap);
  }

  public createGraph(sensorDataMap) {
    //first we get all the keys and values from the sensorDataMap
    sensorDataMap.forEach((value, key) => {
      //get the sensor from the sensorService using the given key
      const sensor = this.sensorService.getSensorByType(key);

      //get the dates and values from the objects in the sensorDataMap
      const dates = [];
      const values = [];
      Object.values(value).forEach(valueObject => {
        dates.push(valueObject["date"]);
        values.push(valueObject["value"]);
      })

      //add the date and values from each measurement into a dataRow so it can be shown into the graph
      const dataRows = [];
      dates.forEach((date, index) => {
          const fullDate = new Date(date)
          const rgb = JSON.parse(values[index])
          //if the sensor name is lighting_rgb, then we will get value by transforming the hexadecimal value into int
          if (key == "lighting_rgb") dataRows[index] = [fullDate, parseInt(rgb.substring(1), 16)]
          else dataRows[index] = [fullDate, parseFloat(values[index])]
        }
      )

      //get the lowest date and the highest date as reference points for the graph
      const minDate = new Date(dates.slice(-1)[0]);
      const maxDate = new Date(dates[0]);

      //get the title to show on the y axis
      const vAxisTitle = `${UnitNames[sensor.unit]} (${ReadableUnit[sensor.unit]})`;

      //create a graph object from all the calculated and received date
      const graph = new Graph(sensor.idx, sensor.readableName, sensor.sensorType, minDate,
        maxDate, vAxisTitle, sensor.minValue, sensor.maxValue, dataRows)

      //add the graph to the graphs array
      this.addGraph(graph);
    })
  }
}
