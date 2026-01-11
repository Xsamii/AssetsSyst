import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { DashboardService } from './services/dashboard.service';
import {
  columnChart,
  enhancedColumnChart,
  pieChart,
  barsChart,
  lineCharts,
  halfGaugeChart,
  fullGaugeChart,
} from 'src/app/core/chartsmodels/projectshighChart';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { MaintenanceContractsService } from '../maintenance/components/maintenance-contracts/services/maintenance-contracts.service';
import { FilterDataParams } from 'src/app/Shared/models/filteredDataParams';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TabViewModule, MultiSelectModule],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
})
export class MainDashboardComponent implements OnInit,  AfterViewInit {
  // Dashboard data properties - all from same API
  topMetrics = {
    mainBuildings: 0,
    totalTasks: 0,
    totalVisits: 0,
    totalAssets: 0,
    totalOffices: 0,
    totalUnits: 0,
    avgProcessingActive: '00:00:00',
    avgResponseActive: '00:00:00',
    totalExpectedRequests: 0,
    totalExecutedRequests: 0,
    totalMaintenanceRequests: 0,
    totalUsers: 0,
    totalSystemRequests: 0,
    totalContracts: 0,
    projectsNeedingFeedback: 0,
    consultantProjects: 0,
  };

  // Dynamic KPI data from API
  maintenanceEvaluationData = {
    totalPercentage: 0,
    chartData: [],
  };

  // Contract evaluation data from API
  contractEvaluationData = {
    totalPercentage: 0,
    chartData: [],
  };

  // Contract evaluation terms for dropdown
  contractEvaluationTerms: any[] = [];

  // Track selected contract ID for dropdown persistence
  selectedContractId: number = 0;

  // Contractors evaluation chart data (new implementation)
  contractorsEvaluationTypes: any[] = []; // Evaluation types dropdown (يومي، أسبوعي، etc.)
  contractorsList: any[] = []; // Contractors list dropdown (للمقاول)
  selectedEvaluationType: number | null = null; // Selected evaluation type ID
  selectedContractorIds: number[] = []; // Selected contractor IDs (empty = all)
  contractorsEvaluationData: any[] = []; // Full data from API
  filteredContractorsEvaluationData: any[] = []; // Filtered data for display

  // Project status data from API
  projectStatusData: { categories: string[]; values: number[] } = {
    categories: [],
    values: [],
  };

  // Maintenance request status data from API
  maintenanceRequestStatusData: any[] = [];

  // Malfunction types data from API
  malfunctionTypesData: any[] = [];

  // New 4 charts data
  assetsByTypeData: any[] = [];
  assetsByEquipmentData: any[] = [];
  assetsByManufacturerData: any[] = [];
  riskLevelData: any[] = [];

  // Chart data
  projectClassificationData: { categories: string[]; values: number[] } = {
    categories: [],
    values: [],
  };

  // Loading states
  isLoading = true;
  chartsLoaded = false;

  // Daily maintenance request count
  dailyMaintenanceCount = 0;

  newsItems: string[] = [];

  constructor(
    private dashboardService: DashboardService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load main dashboard counts - all data comes from one API
    this.dashboardService.getCounts().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.updateTopMetrics(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading dashboard counts:', error);
      },
    });

    // Load maintenance evaluation data for KPI charts
    this.loadMaintenanceEvaluationData();

    // Load contract evaluation data for large-kpi-2 (keep for the circle chart)
    this.loadContractEvaluationData();

    // Load NEW contractors evaluation data with dropdowns for the bar chart
    this.loadContractorsEvaluationData();

    // Load project status data
    this.loadProjectStatusData();

    // Load maintenance request status data
    this.loadMaintenanceRequestStatusData();

    // Load malfunction types data
    this.loadMalfunctionTypesData();

    // Load daily maintenance request count
    this.loadDailyMaintenanceCount();

    // Load NEW 4 charts data
    this.loadAssetsByTypeData();
    this.loadAssetsByEquipmentData();
    this.loadAssetsByManufacturerData();
    this.loadRiskLevelData();

    // Load other chart data
    this.loadChartsData();
  }

  loadMaintenanceEvaluationData(): void {
    this.dashboardService.getMantinanceEvaluationChartsForRequest().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.maintenanceEvaluationData = {
            totalPercentage: response.data.totalPercentage,
            chartData: response.data.chartDate || [],
          };

          // Render KPI charts after data is loaded
          setTimeout(() => {
            this.renderDynamicKPICharts();
          }, 200);
        } else {
          this.showNoDataMessage('large-kpi-1', 'لا توجد بيانات متاحة');
          this.showNoDataForKPICircles();
        }
      },
      error: (error) => {
        console.error('Error loading maintenance evaluation data:', error);
        this.showNoDataMessage('large-kpi-1', 'خطأ في تحميل البيانات');
        this.showNoDataForKPICircles();
      },
    });
  }

  loadContractEvaluationData(): void {
    // First load the contract evaluation terms for dropdown
    this.sharedService.getAllContractor().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.contractEvaluationTerms = response.data;

          // Load initial chart data with contractId = 0 (all contracts)
          this.loadContractDataById(0);
          this.dashboardService
          .getMantinanceEvaluationChartsForContract(0)
          .subscribe({
            next: (response) => {
              if (response.isSuccess && response.data) {
                this.contractEvaluationData = {
                  totalPercentage: response.data.totalPercentage,
                  chartData: response.data.chartDate || [],
                };

                setTimeout(() => {
                  this.renderContractLargeKPI();
                }, 300);
              } else {
                this.showNoDataMessage('large-kpi-2', 'لا توجد بيانات متاحة');
                this.showNoDataMessage(
                  'contract-status-index-chart',
                  'لا توجد بيانات متاحة'
                );
              }
            },
            error: (error) => {
              console.error(
                'Error loading contract evaluation data for ID',
                0,
                ':',
                error
              );
              this.showNoDataMessage('large-kpi-2', 'خطأ في تحميل البيانات');
              this.showNoDataMessage(
                'contract-status-index-chart',
                'خطأ في تحميل البيانات'
              );
            },
          });

        } else {
          console.error('Failed to load contract evaluation terms');
          this.loadContractDataById(0); // Fallback to load with 0
        }
      },
      error: (error) => {
        console.error('Error loading contract evaluation terms:', error);
        this.loadContractDataById(0); // Fallback to load with 0
      },
    });
  }

  // Load contract data by ID and store the selected ID for dropdown persistence
  // loadContractDataById(contractId: number): void {
  //   // Store the selected contract ID
  //   this.selectedContractId = contractId;

  //   this.dashboardService
  //     .getMantinanceEvaluationChartsForContract(contractId)
  //     .subscribe({
  //       next: (response) => {
  //         if (response.isSuccess && response.data) {
  //           this.contractEvaluationData = {
  //             totalPercentage: response.data.totalPercentage,
  //             chartData: response.data.chartDate || [],
  //           };

  //           setTimeout(() => {
  //             this.renderContractCharts();
  //           }, 300);
  //         } else {
  //           this.showNoDataMessage('large-kpi-2', 'لا توجد بيانات متاحة');
  //           this.showNoDataMessage(
  //             'contract-status-index-chart',
  //             'لا توجد بيانات متاحة'
  //           );
  //         }
  //       },
  //       error: (error) => {
  //         console.error(
  //           'Error loading contract evaluation data for ID',
  //           contractId,
  //           ':',
  //           error
  //         );
  //         this.showNoDataMessage('large-kpi-2', 'خطأ في تحميل البيانات');
  //         this.showNoDataMessage(
  //           'contract-status-index-chart',
  //           'خطأ في تحميل البيانات'
  //         );
  //       },
  //     });
  // }


loadContractDataById(contractId: number): void {
  this.selectedContractId = contractId;

  this.dashboardService
    .getMantinanceEvaluationChartsForContract(contractId)
    .subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          // Check if chartDate array is empty or all values are 0
          const hasData = response.data.chartDate &&
                         response.data.chartDate.length > 0 &&
                         response.data.chartDate.some((item: any) => item.percentage > 0);

          if (hasData) {
            this.contractEvaluationData = {
              totalPercentage: response.data.totalPercentage,
              chartData: response.data.chartDate || [],
            };

            setTimeout(() => {
              this.renderContractCharts();
            }, 300);
          } else {
            // No data for this contractor - show empty state
            this.showNoDataMessage('large-kpi-2', 'لا تتوفر بيانات لهذا المؤشر');
            this.showNoDataForContractChart(contractId);
          }
        } else {
          this.showNoDataMessage('large-kpi-2', 'لا توجد بيانات متاحة');
          this.showNoDataForContractChart(contractId);
        }
      },
      error: (error) => {
        console.error('Error loading contract evaluation data:', error);
        this.showNoDataMessage('large-kpi-2', 'خطأ في تحميل البيانات');
        this.showNoDataForContractChart(contractId);
      },
    });
}

// New helper method to show empty state while preserving dropdown
showNoDataForContractChart(contractId: number): void {
  // Preserve dropdown by re-rendering chart with empty data
  const dropdownOptions = [
    { value: 0, label: 'جميع العقود' },
    ...this.contractEvaluationTerms.map((term) => ({
      value: Number(term.id),
      label: term.name || 'غير محدد',
    })),
  ];

  enhancedColumnChart({
    id: 'contract-status-index-chart',
    categories: ['لا توجد بيانات'],
    seriesData: [0],
    color: ['#16968C'],
    showDropdown: false,
    dropdownOptions: dropdownOptions,
    selectedValue: contractId,
    maxValue: 100,
    tickInterval: 20,
    showDataLabels: false,
    onDropdownChange: (value: string) => {
      const newContractId = parseInt(value, 10);
      if (!isNaN(newContractId)) {
        this.loadContractDataById(newContractId);
      }
    },
  });

  // Optionally add a custom message overlay
  const chartElement = document.getElementById('contract-status-index-chart');
  if (chartElement) {
    // Ensure parent has relative positioning
    chartElement.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
      font-size: 16px;
      pointer-events: none;
      z-index: 10;
    `;
    overlay.innerHTML = `
      <i class="pi pi-info-circle" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
      لا تتوفر بيانات لهذا المؤشر
    `;

    // Remove existing overlay if any
    const existingOverlay = chartElement.querySelector('.no-data-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    overlay.className = 'no-data-overlay';
    chartElement.appendChild(overlay);
  }
}

  // ====================================
  // NEW CONTRACTORS EVALUATION CHART
  // ====================================

  loadContractorsEvaluationData(): void {
    // Load both dropdowns data first
    this.sharedService.GetEveContracterType().subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.contractorsEvaluationTypes = response.data;

          // Set first evaluation type as default
          if (this.contractorsEvaluationTypes.length > 0) {
            this.selectedEvaluationType = this.contractorsEvaluationTypes[0].id;
          }
        }
      },
      error: (error) => {
        console.error('Error loading evaluation types:', error);
      }
    });

    // Load contractors list
    this.sharedService.getOfficeList().subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.contractorsList = response.data;

          // Load chart data with first evaluation type (if available)
          if (this.selectedEvaluationType !== null) {
            this.loadContractorsChartData();
          }
        }
      },
      error: (error) => {
        console.error('Error loading contractors list:', error);
      }
    });
  }

  loadContractorsChartData(): void {
    if (this.selectedEvaluationType === null) {
      return;
    }

    // Only send contractor IDs if specific contractors are selected (not empty array)
    const contractorIds = this.selectedContractorIds.length > 0 ? this.selectedContractorIds : [];

    this.dashboardService
      .getContractorsEvaluationPercentages(this.selectedEvaluationType, contractorIds)
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.contractorsEvaluationData = response.data;
            this.filteredContractorsEvaluationData = response.data;

            setTimeout(() => {
              this.renderContractorsEvaluationChart();
            }, 300);
          } else {
            this.showNoDataMessage('contract-status-index-chart', 'لا توجد بيانات متاحة');
          }
        },
        error: (error) => {
          console.error('Error loading contractors evaluation data:', error);
          this.showNoDataMessage('contract-status-index-chart', 'خطأ في تحميل البيانات');
        }
      });
  }

  onEvaluationTypeChange(evaluationTypeId: number): void {
    this.selectedEvaluationType = evaluationTypeId;
    this.loadContractorsChartData();
  }

  onContractorFilterChange(contractorIds: number[]): void {
    this.selectedContractorIds = contractorIds || [];
    this.loadContractorsChartData();
  }

  renderContractorsEvaluationChart(): void {
    if (this.filteredContractorsEvaluationData.length === 0) {
      this.showNoDataMessage('contract-status-index-chart', 'لا توجد بيانات متاحة');
      return;
    }

    // Extract categories and values from filtered data
    const categories = this.filteredContractorsEvaluationData.map(item => item.contractorName || 'غير محدد');
    const values = this.filteredContractorsEvaluationData.map(item => item.evaluationPercentage || 0);

    // Define color thresholds for performance-based coloring
    const colors = values.map(value => {
      if (value >= 70) return '#16968C'; // Teal/Green for good performance (>=70%)
      return '#FF6B6B'; // Red for poor performance (<70%)
    });

    columnChart({
      id: 'contract-status-index-chart',
      categories: categories,
      seriesData: values,
      color: colors
    });
  }








  loadProjectStatusData(): void {
    this.dashboardService.getProjectStatusData().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.projectStatusData = this.transformProjectStatusData(
            response.data
          );

          setTimeout(() => {
            this.renderProjectStatusChart();
          }, 400);
        } else {
          this.showNoDataMessage(
            'project-status-index-chart',
            'لا توجد بيانات متاحة'
          );
        }
      },
      error: (error) => {
        console.error('Error loading project status data:', error);
        this.showNoDataMessage(
          'project-status-index-chart',
          'خطأ في تحميل البيانات'
        );
      },
    });
  }

  loadMaintenanceRequestStatusData(): void {
    this.dashboardService.getMaintenanceRequestStatusChart().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.maintenanceRequestStatusData = response.data;

          setTimeout(() => {
            this.renderMaintenanceRequestStatusChart();
          }, 500);
        } else {
          this.showNoDataMessage(
            'maintenance-status-donut',
            'لا توجد بيانات متاحة'
          );
        }
      },
      error: (error) => {
        console.error('Error loading maintenance request status data:', error);
        this.showNoDataMessage(
          'maintenance-status-donut',
          'خطأ في تحميل البيانات'
        );
      },
    });
  }

  loadMalfunctionTypesData(): void {
    this.dashboardService.getMalfunctionsTypesChart().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.malfunctionTypesData = response.data;

          setTimeout(() => {
            this.renderMalfunctionTypesChart();
          }, 600);
        } else {
          this.showNoDataMessage('failure-types-donut', 'لا توجد بيانات متاحة');
        }
      },
      error: (error) => {
        console.error('Error loading malfunction types data:', error);
        this.showNoDataMessage('failure-types-donut', 'خطأ في تحميل البيانات');
      },
    });
  }

  // Add these properties to your component class
  dailyMaintenanceRequests: any[] = [];
  currentMaintenanceIndex: number = 0;
  maintenanceInterval: any;

  // Update the loadDailyMaintenanceCount method
  // loadDailyMaintenanceCount(): void {
  //   this.dashboardService.getProjectDailyMaintenanceRequestCount().subscribe({
  //     next: (response) => {
  //       if (
  //         response.isSuccess &&
  //         response.data &&
  //         Array.isArray(response.data)
  //       ) {
  //         this.dailyMaintenanceRequests = response.data;
  //         this.currentMaintenanceIndex = 0;
  //         this.startMaintenanceTicker();
  //       } else {
  //         this.dailyMaintenanceRequests = [];
  //         this.stopMaintenanceTicker();
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading daily maintenance count:', error);
  //       this.dailyMaintenanceRequests = [];
  //       this.stopMaintenanceTicker();
  //     },
  //   });
  // }

  // Add these new methods
  startMaintenanceTicker(): void {
    this.stopMaintenanceTicker(); // Clear any existing interval

    if (this.dailyMaintenanceRequests.length > 1) {
      this.maintenanceInterval = setInterval(() => {
        this.currentMaintenanceIndex =
          (this.currentMaintenanceIndex + 1) %
          this.dailyMaintenanceRequests.length;
      }, 5000); // 10 seconds
    }
  }

  stopMaintenanceTicker(): void {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
      this.maintenanceInterval = null;
    }
  }

  getCurrentMaintenanceRequest(): any {
    if (this.dailyMaintenanceRequests.length > 0) {
      return this.dailyMaintenanceRequests[this.currentMaintenanceIndex];
    }
    return null;
  }

  // Update ngOnDestroy to clear the interval
  ngOnDestroy(): void {
    this.stopMaintenanceTicker();
  }

  showNoDataMessage(elementId: string, message: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; color: #666; font-size: 14px; text-align: center;">
          <div>
            <i class="pi pi-info-circle" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            ${message}
          </div>
        </div>
      `;
    }
  }

  // Helper method to show "No data" for KPI circles
  showNoDataForKPICircles(): void {
    for (let i = 1; i <= 8; i++) {
      this.showNoDataMessage(`kpi-circle-${i}`, 'لا توجد بيانات');
    }
  }

  renderContractCharts(): void {
    this.renderContractLargeKPI();
    // OLD: this.renderContractColumnChart(); - Now using new implementation with dropdowns
  }

  renderContractLargeKPI(): void {
    if (this.contractEvaluationData.totalPercentage) {
      halfGaugeChart({
        id: 'large-kpi-2',
        value:
          Math.round(this.contractEvaluationData.totalPercentage * 10) / 10,
        color: '#16968C',
        name: 'Contract Performance',
      });
    } else {
      this.showNoDataMessage('large-kpi-2', 'لا توجد بيانات متاحة');
    }
  }

  renderContractColumnChart(): void {
    if (
      this.contractEvaluationData.chartData &&
      this.contractEvaluationData.chartData.length > 0
    ) {
      const categories = this.contractEvaluationData.chartData.map(
        (item: any) => item.name || 'غير محدد'
      );
      const values = this.contractEvaluationData.chartData.map((item: any) =>
        Number(item.percentage || 0)
      );

      // Create dropdown options from API data
      const dropdownOptions = [
        { value: 0, label: 'جميع العقود' }, // Default "All contracts" option
        ...this.contractEvaluationTerms.map((term) => ({
          value: Number(term.id), // Ensure it's a number
          label: term.name || 'غير محدد',
        })),
      ];

      enhancedColumnChart({
        id: 'contract-status-index-chart',
        categories: categories,
        seriesData: values,
        color: ['#16968C'],
        // titleText: 'مؤشر حالات العقود',
        showDropdown: true,
        dropdownOptions: dropdownOptions,
        selectedValue: this.selectedContractId, // Pass the currently selected value
        maxValue: 100,
        tickInterval: 20,
        showDataLabels: false,
        onDropdownChange: (value: string) => {
          const contractId = parseInt(value, 10);

          if (isNaN(contractId)) {
            console.error('Invalid contract ID:', value);
            return;
          }
          this.loadContractDataById(contractId);
        },
      });
    } else {
      this.showNoDataMessage(
        'contract-status-index-chart',
        'لا توجد بيانات متاحة'
      );
    }
  }

  renderProjectStatusChart(): void {
    if (
      this.projectStatusData.categories &&
      this.projectStatusData.values &&
      this.projectStatusData.categories.length > 0
    ) {
      columnChart({
        id: 'project-status-index-chart',
        categories: this.projectStatusData.categories,
        seriesData: this.projectStatusData.values,
        color: [
          '#16968C',
          '#255E5D',
          '#126560',
          '#0C588B',
          '#158980',
          '#146F69',
        ],
      });
    } else {
      this.showNoDataMessage(
        'project-status-index-chart',
        'لا توجد بيانات متاحة'
      );
    }
  }

  renderMaintenanceRequestStatusChart(): void {
    if (
      this.maintenanceRequestStatusData &&
      this.maintenanceRequestStatusData.length > 0
    ) {
      const filteredData = this.maintenanceRequestStatusData;

      const pieData = filteredData.map((item) => ({
        name: item.name || 'غير محدد',
        y: Number(Number(item.percentage || 0).toFixed(1)),
        totalCount: Number(item.totalCount || 0),
      }));

      const totalCount = this.maintenanceRequestStatusData.reduce(
        (sum, item) => sum + Number(item.totalCount || 0),
        0
      );

      pieChart({
        id: 'maintenance-status-donut',
        seriesData: pieData,
        projectCount: totalCount,
        titleText: 'الإجمالي',
        legend: false,
        color: [
          '#16968C',
          '#255E5D',
          '#126560',
          '#0C588B',
          '#158980',
          '#146F69',
        ],
      });
    } else {
      this.showNoDataMessage(
        'maintenance-status-donut',
        'لا توجد بيانات متاحة'
      );
    }
  }

  renderMalfunctionTypesChart(): void {
    if (this.malfunctionTypesData && this.malfunctionTypesData.length > 0) {
      const filteredData = this.malfunctionTypesData;
      // Calculate total count for percentage calculation
      const totalCount = filteredData.reduce(
        (sum, item) => sum + Number(item.totalCount || 0),
        0
      );

      const pieData = filteredData.map((item) => {
        const count = Number(item.totalCount || 0);
        const percentage =
          totalCount > 0 ? Number(((count / totalCount) * 100).toFixed(1)) : 0;

        return {
          name: item.name || 'غير محدد',
          y: percentage,
          totalCount: count,
        };
      });

      pieChart({
        id: 'failure-types-donut',
        seriesData: pieData,
        projectCount: totalCount,
        titleText: 'الإجمالي',
        legend: false,
        color: [
          '#16968C',
          '#255E5D',
          '#126560',
          '#0C588B',
          '#158980',
          '#146F69',
        ],
      });
    } else {
      this.showNoDataMessage('failure-types-donut', 'لا توجد بيانات متاحة');
    }
  }

  updateTopMetrics(data: any): void {
    this.topMetrics = {
      mainBuildings: data.totalMainBuilidngs ?? 'لا توجد بيانات',
      totalTasks: data.totalProjectTasks ?? 'لا توجد بيانات',
      totalVisits: data.totalVisites ?? 'لا توجد بيانات',
      totalAssets: data.totalassites ?? 'لا توجد بيانات',
      totalOffices: data.totalOffices ?? 'لا توجد بيانات',
      totalUnits: data.totalSubUnits ?? 'لا توجد بيانات',
      avgProcessingActive: data.averageOfSolve
        ? this.formatTime(data.averageOfSolve)
        : 'لا توجد بيانات',
      avgResponseActive: data.averageOfResponse
        ? this.formatTime(data.averageOfResponse)
        : 'لا توجد بيانات',
      totalExpectedRequests: data.totalOpenedRequest ?? 'لا توجد بيانات',
      totalExecutedRequests: data.totalClosedRequest ?? 'لا توجد بيانات',
      totalMaintenanceRequests: data.totalRequest ?? 'لا توجد بيانات',
      totalUsers: data.totalUsers ?? 'لا توجد بيانات',
      totalSystemRequests: data.totalPieceRequest ?? 'لا توجد بيانات',
      totalContracts: data.totalContract ?? 'لا توجد بيانات',
      projectsNeedingFeedback: data.totalExecutableProject ?? 'لا توجد بيانات',
      consultantProjects: data.totalConsultingProject ?? 'لا توجد بيانات',
    };

    this.isLoading = false;
  }

  loadChartsData(): void {
    this.dashboardService.getProjectClassificationData().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.projectClassificationData =
            this.transformProjectClassificationData(response.data);
          setTimeout(() => this.renderProjectClassificationChart(), 100);
        } else {
          this.showNoDataMessage(
            'project-classification-chart',
            'لا توجد بيانات متاحة'
          );
        }
      },
      error: (error) => {
        console.error('Error loading project classification data:', error);
        this.showNoDataMessage(
          'project-classification-chart',
          'خطأ في تحميل البيانات'
        );
      },
    });
  }

  renderDynamicKPICharts(): void {
    this.renderLargeKPIs();
    this.renderDynamicKPICircles();
  }

  renderDynamicKPICircles(): void {
    this.clearKPICharts();

    if (
      this.maintenanceEvaluationData.chartData &&
      this.maintenanceEvaluationData.chartData.length > 0
    ) {
      this.maintenanceEvaluationData.chartData.forEach(
        (kpi: any, index: number) => {
          const chartId = `kpi-circle-${index + 1}`;

          this.ensureChartElementExists(chartId);
          fullGaugeChart({
            id: chartId,
            value: Math.round(kpi.percentage * 10) / 10 || 0,
            color: '#16968C',
            name: kpi.name || 'غير محدد',
          });
        }
      );
    } else {
      this.showNoDataForKPICircles();
    }
  }

  renderLargeKPIs(): void {
    if (this.maintenanceEvaluationData.totalPercentage) {
      halfGaugeChart({
        id: 'large-kpi-1',
        value:
          Math.round(this.maintenanceEvaluationData.totalPercentage * 10) /
            10 || 0,
        color: '#16968C',
        name: 'Overall Performance',
      });
    } else {
      this.showNoDataMessage('large-kpi-1', 'لا توجد بيانات متاحة');
    }

    if (!this.contractEvaluationData.totalPercentage) {
      this.showNoDataMessage('large-kpi-2', 'لا توجد بيانات متاحة');
    }
  }

  ensureChartElementExists(chartId: string): void {
    if (!document.getElementById(chartId)) {
      console.warn(
        `Chart element with id "${chartId}" not found. Make sure it exists in the HTML.`
      );
    }
  }

  clearKPICharts(): void {
    for (let i = 1; i <= 8; i++) {
      const chartElement = document.getElementById(`kpi-circle-${i}`);
      if (chartElement) {
        chartElement.innerHTML = '';
      }
    }
  }

  getDynamicChartData(): any[] {
    return this.maintenanceEvaluationData.chartData || [];
  }

  getTotalPercentage(): number {
    return this.maintenanceEvaluationData.totalPercentage || 0;
  }

  getContractChartData(): any[] {
    return this.contractEvaluationData.chartData || [];
  }

  getContractTotalPercentage(): number {
    return this.contractEvaluationData.totalPercentage || 0;
  }

  transformProjectStatusData(data: any[]): {
    categories: string[];
    values: number[];
  } {
    const filteredData = data;

    const categories = filteredData.map((item) => item.name || 'غير محدد');
    const values = filteredData.map((item) => Number(item.totalCount || 0));

    return { categories, values };
  }

  transformProjectClassificationData(data: any[]): {
    categories: string[];
    values: number[];
  } {
    const categories = data.map((item) => item.name || 'غير محدد');
    const values = data.map((item) =>
      Number(item.totalCount || item.count || 0)
    );

    return { categories, values };
  }

  renderProjectClassificationChart(): void {
    if (
      this.projectClassificationData.categories &&
      this.projectClassificationData.values &&
      this.projectClassificationData.categories.length > 0
    ) {
      columnChart({
        id: 'project-classification-chart',
        categories: this.projectClassificationData.categories,
        seriesData: this.projectClassificationData.values,
        color: [
          '#16968C',
          '#255E5D',
          '#126560',
          '#0C588B',
          '#158980',
          '#146F69',
        ],
      });
    } else {
      this.showNoDataMessage(
        'project-classification-chart',
        'لا توجد بيانات متاحة'
      );
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return '00:00:00';

    // Handle time format with decimals anywhere
    if (timeString.includes(':') && timeString.includes('.')) {
      const parts = timeString.split(':');

      // Remove decimals from each part
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes('.')) {
          parts[i] = parts[i].split('.')[0];
        }
      }

      return parts.join(':');
    }

    // Handle regular time format with colons
    if (timeString.includes(':')) {
      return timeString;
    }

    // Handle minutes only
    const minutes = parseInt(timeString);
    if (!isNaN(minutes)) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:00`;
    }

    return timeString;
  }

  refreshCharts(): void {
    setTimeout(() => {
      this.renderProjectClassificationChart();
      this.renderDynamicKPICharts();
      this.renderContractCharts();
      this.renderProjectStatusChart();
      this.renderMaintenanceRequestStatusChart();
      this.renderMalfunctionTypesChart();
    }, 500);
  }

  handleChartError(chartName: string, error: any): void {
    console.error(`Error rendering ${chartName}:`, error);
  }

//   loadDailyMaintenanceCount(): void {
//   this.dashboardService.getProjectDailyMaintenanceRequestCount().subscribe({
//     next: (response) => {
//       if (response.isSuccess && response.data && Array.isArray(response.data)) {
//         this.dailyMaintenanceRequests = response.data;
//       } else {
//         this.dailyMaintenanceRequests = [];
//       }
//     },
//     error: (error) => {
//       console.error('Error loading daily maintenance count:', error);
//       this.dailyMaintenanceRequests = [];
//     },
//   });
// }

 ngAfterViewInit(): void {
  // Wait longer for content to render
  setTimeout(() => {
    this.setupTickerAnimation();
  }, 1000); // Increased from 500ms
}

setupTickerAnimation(): void {
  const tickerContent = document.querySelector('.ticker-content') as HTMLElement;
  if (!tickerContent) {
    return;
  }

  const contentWidth = tickerContent.scrollWidth;
  const containerWidth = tickerContent.parentElement?.clientWidth || 0;

  if (contentWidth === 0) {
    setTimeout(() => this.setupTickerAnimation(), 500);
    return;
  }

  // Calculate duration based on number of items
  const itemCount = this.dailyMaintenanceRequests.length;
  const secondsPerItem = 3;
  const duration = Math.max(10, itemCount * secondsPerItem);

  // Create dynamic keyframes - end position should be container width + content width
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes ticker-dynamic {
      0% {
        transform: translateX(${containerWidth}px);
      }
      100% {
        transform: translateX(-${containerWidth + contentWidth}px);
      }
    }
  `;

  // Remove old rule if exists
  for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
    if (styleSheet.cssRules[i].cssText.includes('ticker-dynamic')) {
      styleSheet.deleteRule(i);
    }
  }

  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  tickerContent.style.animation = `ticker-dynamic ${duration}s linear infinite`;

}

loadDailyMaintenanceCount(): void {
  this.dashboardService.getProjectDailyMaintenanceRequestCount().subscribe({
    next: (response) => {
      if (response.isSuccess && response.data && Array.isArray(response.data)) {
        this.dailyMaintenanceRequests = response.data;

        // Recalculate animation after data loads - longer delay
        setTimeout(() => {
          this.setupTickerAnimation();
        }, 500); // Increased delay
      } else {
        this.dailyMaintenanceRequests = [];
      }
    },
    error: (error) => {
      console.error('Error loading daily maintenance count:', error);
      this.dailyMaintenanceRequests = [];
    },
  });
}

// ====================================
// NEW 4 CHARTS METHODS
// ====================================

loadAssetsByTypeData(): void {
  // TODO: Replace with actual API endpoint when ready
  // For now using mock data
  this.assetsByTypeData = [
    { name: 'AC SYSTEM', percentage: 49.3, totalCount: 100 },
    { name: 'PANELBOARDS SYSTEM', percentage: 38.8, totalCount: 80 },
    { name: 'SMALLPOWER SYSTEM', percentage: 3.5, totalCount: 7 },
    { name: 'FIREFIGHTINGSYSTEM', percentage: 2.0, totalCount: 4 },
    { name: 'REF SYSTEM', percentage: 1.2, totalCount: 2 }
  ];

  setTimeout(() => {
    this.renderAssetsByTypeChart();
  }, 700);
}

loadAssetsByEquipmentData(): void {
  // TODO: Replace with actual API endpoint when ready
  // For now using mock data
  this.assetsByEquipmentData = [
    { name: 'Structural', percentage: 26.7, totalCount: 50 },
    { name: 'ELECTRICAL', percentage: 26.7, totalCount: 50 },
    { name: 'Mechanical', percentage: 23.6, totalCount: 45 },
    { name: 'ELECTRICAL', percentage: 16.6, totalCount: 31 },
    { name: 'Structural', percentage: 4.7, totalCount: 9 },
    { name: 'Architectural', percentage: 1.7, totalCount: 3 }
  ];

  setTimeout(() => {
    this.renderAssetsByEquipmentChart();
  }, 800);
}

loadAssetsByManufacturerData(): void {
  // TODO: Replace with actual API endpoint when ready
  // For now using mock data
  this.assetsByManufacturerData = [
    { name: 'LV', percentage: 50.7, totalCount: 150 },
    { name: 'Plumbing', percentage: 12.7, totalCount: 38 },
    { name: 'Windows', percentage: 8.2, totalCount: 24 },
    { name: 'Doors', percentage: 7.2, totalCount: 21 },
    { name: 'LIGHTING SYSTEM', percentage: 6.5, totalCount: 19 },
    { name: 'LV', percentage: 5.8, totalCount: 17 },
    { name: 'MV', percentage: 2.2, totalCount: 6 }
  ];

  setTimeout(() => {
    this.renderAssetsByManufacturerChart();
  }, 900);
}

loadRiskLevelData(): void {
  // TODO: Replace with actual API endpoint when ready
  // For now using mock data
  this.riskLevelData = [
    { name: 'مباني خزانات المياة', percentage: 45.2, totalCount: 120 },
    { name: 'مبني خزان الدم', percentage: 38.2, totalCount: 101 },
    { name: 'مباني ذبح و سلخ', percentage: 16.7, totalCount: 44 }
  ];

  setTimeout(() => {
    this.renderRiskLevelChart();
  }, 1000);
}

renderAssetsByTypeChart(): void {
  if (this.assetsByTypeData && this.assetsByTypeData.length > 0) {
    const pieData = this.assetsByTypeData.map((item) => ({
      name: item.name || 'غير محدد',
      y: Number(item.percentage || 0),
      totalCount: Number(item.totalCount || 0),
    }));

    const totalCount = this.assetsByTypeData.reduce(
      (sum, item) => sum + Number(item.totalCount || 0),
      0
    );

    pieChart({
      id: 'assets-by-type-chart',
      seriesData: pieData,
      projectCount: totalCount,
      titleText: 'الإجمالي',
      legend: true,
      color: [
        '#16968C',
        '#255E5D',
        '#126560',
        '#0C588B',
        '#158980',
        '#146F69',
      ],
    });
  } else {
    this.showNoDataMessage('assets-by-type-chart', 'لا توجد بيانات متاحة');
  }
}

renderAssetsByEquipmentChart(): void {
  if (this.assetsByEquipmentData && this.assetsByEquipmentData.length > 0) {
    const pieData = this.assetsByEquipmentData.map((item) => ({
      name: item.name || 'غير محدد',
      y: Number(item.percentage || 0),
      totalCount: Number(item.totalCount || 0),
    }));

    const totalCount = this.assetsByEquipmentData.reduce(
      (sum, item) => sum + Number(item.totalCount || 0),
      0
    );

    pieChart({
      id: 'assets-by-equipment-chart',
      seriesData: pieData,
      projectCount: totalCount,
      titleText: 'الإجمالي',
      legend: true,
      color: [
        '#16968C',
        '#255E5D',
        '#126560',
        '#0C588B',
        '#158980',
        '#146F69',
      ],
    });
  } else {
    this.showNoDataMessage('assets-by-equipment-chart', 'لا توجد بيانات متاحة');
  }
}

renderAssetsByManufacturerChart(): void {
  if (this.assetsByManufacturerData && this.assetsByManufacturerData.length > 0) {
    const pieData = this.assetsByManufacturerData.map((item) => ({
      name: item.name || 'غير محدد',
      y: Number(item.percentage || 0),
      totalCount: Number(item.totalCount || 0),
    }));

    const totalCount = this.assetsByManufacturerData.reduce(
      (sum, item) => sum + Number(item.totalCount || 0),
      0
    );

    pieChart({
      id: 'assets-by-manufacturer-chart',
      seriesData: pieData,
      projectCount: totalCount,
      titleText: 'الإجمالي',
      legend: true,
      color: [
        '#16968C',
        '#255E5D',
        '#126560',
        '#0C588B',
        '#158980',
        '#146F69',
      ],
    });
  } else {
    this.showNoDataMessage('assets-by-manufacturer-chart', 'لا توجد بيانات متاحة');
  }
}

renderRiskLevelChart(): void {
  if (this.riskLevelData && this.riskLevelData.length > 0) {
    const pieData = this.riskLevelData.map((item) => ({
      name: item.name || 'غير محدد',
      y: Number(item.percentage || 0),
      totalCount: Number(item.totalCount || 0),
    }));

    const totalCount = this.riskLevelData.reduce(
      (sum, item) => sum + Number(item.totalCount || 0),
      0
    );

    pieChart({
      id: 'risk-level-chart',
      seriesData: pieData,
      projectCount: totalCount,
      titleText: 'الإجمالي',
      legend: true,
      color: [
        '#16968C',
        '#255E5D',
        '#126560',
        '#0C588B',
        '#158980',
        '#146F69',
      ],
    });
  } else {
    this.showNoDataMessage('risk-level-chart', 'لا توجد بيانات متاحة');
  }
}
}
