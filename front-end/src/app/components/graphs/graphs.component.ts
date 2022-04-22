import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Graph} from "../../models/graph";
import {GraphsService} from "../../services/graphs/graphs.service";
import {SensorsService} from "../../services/sensors/sensors.service";
import {from, Observable, Subscription} from "rxjs";
import * as $ from 'jquery';
import {ReadableUnit} from "../../models/units";
import {AccountsService} from "../../services/accounts/accounts.service";

declare const google: any;

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})

export class GraphsComponent implements OnInit, OnDestroy {
  public graphs: Graph[];
  public graphSubscription: Subscription;
  public isTargetValue: boolean = false;
  public isLoading: boolean = true;
  public activeChartType: number = 0;
  public sensorId: string;


  constructor(private graphService: GraphsService, private sensorService: SensorsService, private accountService: AccountsService) {
  }

  ngOnInit(): void {
    //initialize the google chart API
    google.charts.load('current', {'packages': ['corechart']});
    //check if the user wants to display values or target values
    this.isTargetValue = this.getDataPreferenceFromLocalStorage();
    //get the preferredChart Type from localstorage
    this.activeChartType = this.getPreferredChartPreferenceFromLocalStorage();
    //get the data using the getGraphData method and then use the handleGraphData method to process the data
    this.graphSubscription = this.getGraphData(this.isTargetValue).subscribe(data => {
      this.handleGraphData(data);
      //make sure isLoading doesn't display that the page is still loading
      this.isLoading = false;
      //start the one minute refresh method
      this.updatePeriodically();
    })
  }

  //reload the components if the screen has changed size
  @HostListener('window:resize')
  onResize() {
    this.reload(this.isTargetValue)
  }

  getIdentifierFromIdx(idx: number): string {
    return this.sensorService.getSensorIdentifierFromIdx(idx);
  }

  getGraphData(isTargetValue: boolean): Observable<Graph[]> {
    //get the graphData using the service and return an Observable
    return from(this.graphService.getGraphs(this.accountService.user.teamId, isTargetValue, 100));
  }

  handleGraphData(graphs: Graph[]) {
    //use the sensorService to map the array of graphs to the right order
    this.graphs = this.sensorService.mapOrder(graphs, this.sensorService.idxLocalStorage);

    //empty divs using the emptyChartDivs function
    this.emptyChartDivs();

    if (this.activeChartType == 1)
      //get all graphs and use the buildChart method to generate the graphs
      this.graphs.forEach(graph => {
        this.buildChart(graph)
        this.buildModalChart(graph)
      })
    else
      //get the first three graphs and use the buildChart method to generate the graphs
      this.graphs.filter(graph => this.graphs.indexOf(graph) < 3).forEach(graph => {
        this.buildChart(graph)
        this.buildModalChart(graph)
      })
  }

  buildChart(graph: Graph) {
    //use a nested function to build the graphs using data and options variables
    let dashBoardGraph = (chart: any) => {
      let data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', graph.title);
      data.addRows(graph.dataRows);

      //set default values for width and height
      let widthValue;
      let heightValue;

      //change the height and width of the chart according to the user input
      if (this.activeChartType == 1) {
        widthValue = 300;
        heightValue = 150;
      } else {
        widthValue = 600;
        heightValue = 300;
      }

      let options = {
        title: graph.title,
        width: widthValue,
        height: heightValue,
        hAxis: {
          title: 'Date (dd-MM-YYYY HH:mm)',
          format: 'dd/MM/yyyy HH:mm',
          gridlines: {
            count: -1,
            units: {
              days: {format: ['MMM dd']},
            }
          },
          viewWindow: {
            min: graph.minDate,
            max: graph.maxDate
          },
          vAxis: {
            title: graph.vAxisTitle,
            gridlines: {count: 5},
            minValue: graph.vAxisMin,
            maxValue: graph.vAxisMax
          },
          chartArea: {'width': '100%', 'height': '80%'},
        }
      }
      //draw the chart
      chart().draw(data, options);
    }

    //get a callback to generate the graphs, once the google chart API has loaded in
    let dashBoardChart = () => new google.visualization.LineChart(document.getElementById('lineChart' + this.graphs.indexOf(graph)));
    let callback = () => dashBoardGraph(dashBoardChart);
    google.charts.setOnLoadCallback(callback);

  }

  public buildModalChart(graph: Graph) {
    this.fillModalData(graph);

    let modalGraph = (chart: any) => {
      let data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', graph.title);
      data.addRows(graph.dataRows);

      //set default values for width and height
      let options = {
        title: graph.title,
        width: 1000,
        height: 500,
        hAxis: {
          title: 'Date (dd-MM-YYYY HH:mm)',
          format: 'dd/MM/yyyy HH:mm',
          gridlines: {
            count: -1,
            units: {
              days: {format: ['MMM dd']},
            }
          },
          viewWindow: {
            min: graph.minDate,
            max: graph.maxDate
          },
          vAxis: {
            title: graph.vAxisTitle,
            gridlines: {count: 5},
            minValue: graph.vAxisMin,
            maxValue: graph.vAxisMax,
          },
        }
      }
      //draw the chart
      chart().draw(data, options);
    }
    let modalChart = () => new google.visualization.LineChart(document.getElementById('graphLocation' + this.graphs.indexOf(graph)));
    let callback = () => modalGraph(modalChart)
    google.charts.setOnLoadCallback(callback);
  }


  public fillModalData(graph: Graph) {
    const graphIndex = this.graphs.indexOf(graph);
    const dataRows = graph.dataRows;

    //first set the modal title as the graph title
    $(`#chartModalTitle${graphIndex}`).text("Sensor History " + graph.title);
    //empty the table body so that the data can be reloaded
    $(`#tableBody${graphIndex}`).html('');

    dataRows.forEach((dataRow, index) => {
      //get the unit by using the sensorService
      const unit = ReadableUnit[this.sensorService.getSensorByType(graph.type).unit];
      let value;
      //if the graphType is lighting_rgb, then we need to convert decimal to hexadecimal
      if (graph.type === 'lighting_rgb') {
        value = dataRow[1].toString(16);
      } else {
        value = dataRow[1];
      }
      //append every row into the table
      $(`#tableBody${graphIndex}`).append(`<tr><th scope="row">${index + 1}</th><td>${value}</td><td>${unit}</td><td>${dataRow[0].toLocaleString()}</td></tr>`)
    })
  }

  onReload(event) {
    //when clicking on one of the two buttons, get the boolean associated and reload the graphs
    this.isTargetValue = this.getBooleanValue(event.currentTarget.value);
    //set the data preference in localstorage, so the app know what value to display
    this.setDataPreferenceFromLocalStorage(this.isTargetValue);
    this.reload(this.isTargetValue);
  }

  reload(isTargetValue: boolean) {
    this.emptyChartDivs();
    //show the user that the graphs are reloading
    this.isLoading = true;
    //reload the graphs using the getGraphData method
    this.graphSubscription = this.getGraphData(isTargetValue).subscribe(data => {
      this.handleGraphData(data);
      //make sure isLoading doesn't display that the page is still loading
      this.isLoading = false;
    })
  }

  reloadModalGraph() {
    this.reload(this.isTargetValue);
  }

  public updatePeriodically() {
    //refresh the graphs every minute by calling the reload method recursively
    setTimeout(() => {
      this.reload(this.getDataPreferenceFromLocalStorage())
      this.updatePeriodically();
    }, 60000)
  }

  public onChartTypeChange(chartType) {
    //update the chartType in the localstorage
    this.setPreferredChartPreferenceFromLocalStorage(chartType);
    this.activeChartType = chartType;
    //reload the chart
    this.reload(this.isTargetValue)
  }

  public getBooleanValue(booleanString): boolean {
    //change a string into a boolean
    return booleanString == 'true';
  }

  public setDataPreferenceFromLocalStorage(isTargetValue: boolean) {
    localStorage.setItem("dataPreference", JSON.stringify(isTargetValue));
  }

  public getDataPreferenceFromLocalStorage(): boolean {
    return JSON.parse(localStorage.getItem("dataPreference"));
  }

  public setPreferredChartPreferenceFromLocalStorage(preferredChartType: number) {
    localStorage.setItem("chartPreference", JSON.stringify(preferredChartType));
  }

  public getPreferredChartPreferenceFromLocalStorage(): number {
    //if the value in localstorage doesn't exist, then we will add it
    if (JSON.parse(localStorage.getItem("chartPreference")) != null) {
      return JSON.parse(localStorage.getItem("chartPreference"));
    } else {
      this.setPreferredChartPreferenceFromLocalStorage(0);
      return 0;
    }
  }

  public emptyChartDivs() {
    for (let i = 0; i < 10; i++) {
      $(`#lineChart${i}`).html('');
      $(`#graphLocation${i}`).html('');
    }
  }

  public ngForNumber(number: number) {
    return new Array(number);
  }

  ngOnDestroy(): void {
    this.graphSubscription.unsubscribe();
  }
}
