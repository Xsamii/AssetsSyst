import { Component, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ProjectsDashboardService } from './services/projects-dashboard.service';
import {
  barsChart,
  columnChart,
  lineCharts,
  pieChart,
} from 'src/app/core/chartsmodels/projectshighChart';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-dashboard',
  standalone: true,
  imports: [BreadCrumbComponent, GoogleMapsModule, CommonModule],
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss'],
})
export class ProjectsDashboardComponent {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  data: {
    executiveProjectCount: number | null;
    advisorProjectCount: number | null;
    visitRequestsCount: number | null;
    visitsCount: number | null;
  };
  display: any;
  zoom = 12;

  hybrid = google.maps.MapTypeId.HYBRID;

  center: google.maps.LatLngLiteral = {
    lat: 21.4225,
    lng: 39.8262,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  radialChart: {
    name: string | null;
    y: number | null;
  }[] = [];
  mapData: {
    lat: number;
    long: number;
    id: number;
  }[] = [];
  projectData;
  counts;
  id;
  taskCompletionData: any[] = []; // Full data from request7
  paginatedTaskData: any[] = []; // Paginated data for chart

  pageSize = 9; // You can change this number as needed
  currentPage = 1;
  totalPages = 0;
  constructor(
    private _dashBoardService: ProjectsDashboardService, // private _projectServices: ProjectService,
    private route: Router
  ) {}

  getData() {
    forkJoin({
      request1: this._dashBoardService.counts(),
      request2: this._dashBoardService.getProjectClassificationChartData(),
      request3: this._dashBoardService.getProjectStatueChartData(),
      request4: this._dashBoardService.getVisitStatueChartData(),
      request5: this._dashBoardService.getProjectsToMap(),
      request6: this._dashBoardService.getVisitRequestStatueChartData(),
      request7: this._dashBoardService.getProjectsTaskCompletionRate(),
    }).subscribe(
      ({
        request1,
        request2,
        request3,
        request4,
        request5,
        request6,
        request7,
      }) => {
        this.data = request1.data;
        this.radialChart = [];
        this.markerPositions = [];
        for (let index = 0; index < request3.data.length; index++) {
          this.radialChart.push({
            name: request3.data.map((x) => x.name)[index],
            y: request3.data.map((x) => x.number)[index],
          });
        }
        this.counts = this.radialChart.reduce((n, { y }) => n + y, 0);

        for (let index = 0; index < request5.data.length; index++) {
          this.markerPositions.push({
            lat: request5.data[index].lat,
            lng: request5.data[index].long,
          });
        }

        pieChart({
          id: 'pieChartContainer',
          seriesData: this.radialChart,
          projectCount: this.counts,
          titleText: 'عدد المشاريع',
        });

        const top15 = [...request2.data]
        .filter(item => item.name)
        .sort((a, b) => b.number - a.number)
        .slice(0, 15);


        columnChart({
          id: 'columnChartContainer',
          categories: top15.map((x) => x.name),
          seriesData: top15.map((x) => x.number),
        });
        lineCharts({
          id: 'lineChartContainer',
          xAxisCategories: request4.data.map((x) => x.day),
          name1: 'تمت الزيارة',
          seriesData1: request4.data.map((x) => x.visited),
          name2: 'لم تتم الزيارة',
          seriesData2: request4.data.map((x) => x.didNotVisited),
        });

        barsChart({
          id: 'barsChartContainer',
          xAxisCategories: request6.data.map((x) => x.name),
          seriesData: request6.data.map((x) => x.number),
        });
        this.taskCompletionData = request7.data;

        this.taskCompletionData = this.taskCompletionData.filter(
          (Rate) => Rate.taskCompletionRate !== null
        );
        this.totalPages = Math.ceil(
          this.taskCompletionData.length / this.pageSize
        );
        this.loadTaskCompletionPage(1);
        return (this.mapData = request5.data);
      }
    );
  }
  loadTaskCompletionPage(page: number) {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize ;
    this.paginatedTaskData = this.taskCompletionData.slice(
      startIndex,
      endIndex
    );

    // Now update the chart with paginated data
    columnChart({
      id: 'columnChartContainer1',
      categories: this.paginatedTaskData.map((x) => x.name),
      seriesData: this.paginatedTaskData.map((x) => x.taskCompletionRate),
    });
  }

  openInfoWindow(marker: MapMarker) {
    this.id = this.mapData.find(
      (x) =>
        x.lat == marker.marker?.getPosition()?.lat() &&
        x.long == marker.marker?.getPosition()?.lng()
    )?.id;
    this.getProjectData(Number(this.id));
    if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }

  getProjectData(id: number) {
    this._dashBoardService.getById(id).subscribe((data) => {
      this.projectData = data.data;
    });
  }

  ngOnInit(): void {
    this.getData();
  }
  viewData() {
    this.route.navigate(['projects/projects-menu/edit/', Number(this.id)]);
  }
}
