import { Component, OnInit } from '@angular/core';
import { SurveyDashboardService } from '../../services/survey-dashboard.service';
import {
  columnChart,
  pieChart,
  halfGaugeChart,
  barsChart
} from 'src/app/core/chartsmodels/projectshighChart';
import { SurveyEnum } from 'src/app/Shared/enums/surveyEnum';

@Component({
  selector: 'app-survey-dashboard',
  templateUrl: './survey-dashboard.component.html',
  styleUrls: ['./survey-dashboard.component.scss']
})
export class SurveyDashboardComponent implements OnInit {

  constructor(private surveyService: SurveyDashboardService) { }

  allSurvey: any[] = [];
  surveyEnum = SurveyEnum

  ngOnInit(): void {
    // Comment out API call to use mock data for testing
    this.getAllSurvey()

    // Using mock data for testing - comment this and uncomment above to use real API
    // this.loadMockData();
  }

  getAllSurvey() {
    this.surveyService.getAllSurvey().subscribe((res) => {
      this.allSurvey = res.data;
      setTimeout(() => {
        this.allSurvey.forEach((survey, sIndex) => {
          survey.questions.forEach((question, qIndex) => {
            this.drawChart(question, sIndex, qIndex);
          });
        });
      }, 100);
    });
  }

  drawChart(question: any, sIndex: number, qIndex: number) {
    const chartId = `chart-${sIndex}-${qIndex}`;

    const container = document.getElementById(chartId);
    if (!container) {
      console.warn(`Chart container ${chartId} not found`);
      return;
    }

    // Check if chart data is empty or has no valid data
    if (!question.chart || question.chart.length === 0) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 14px;">
          <div style="text-align: center;">
            <i class="pi pi-info-circle" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            لا توجد بيانات
          </div>
        </div>
      `;
      return;
    }

    // Define color palette matching main dashboard
    const colorPalette = ['#16968C', '#255E5D', '#126560', '#0C588B', '#158980', '#146F69'];

    switch (question.questionType) {
      case this.surveyEnum.BoolChoice:
        // Calculate total for percentage
        const total = question.chart.reduce((sum: number, item: any) => sum + (item.answerCountOrAvrage || 0), 0);

        // Transform data for pie chart
        const pieData = question.chart.map((c: any) => ({
          name: c.answerName,
          y: total > 0 ? Number(((c.answerCountOrAvrage / total) * 100).toFixed(1)) : 0,
          totalCount: c.answerCountOrAvrage
        }));

        pieChart({
          id: chartId,
          seriesData: pieData,
          projectCount: total,
          titleText: 'الإجمالي',
          legend: true,
          color: colorPalette
        });
        break;

      case this.surveyEnum.StarsRating:
        const ratingValue = question.chart[0]?.answerCountOrAvrage || 0;
        halfGaugeChart({
          id: chartId,
          value: ratingValue,
          max: 100,
          color: colorPalette[0]
        });
        break;

      case this.surveyEnum.Rating: {
        const ratingValue = question.chart[0]?.answerCountOrAvrage || 0;
        const ratingLabels = ['ضعيف جداً', 'ضعيف', 'جيد', 'جيد جداً', 'ممتاز'];

        const series = ratingLabels.map((label, index) => ({
          name: label,
          y: index + 1 === ratingValue ? 100 : 0,
        }));

        barsChart({
          id: chartId,
          xAxisCategories: ratingLabels,
          seriesData: series,
          color: colorPalette
        });

        break;
      }

      case this.surveyEnum.Choice:
        columnChart({
          id: chartId,
          seriesData: question.chart.map((c: any) => c.answerCountOrAvrage),
          categories: question.chart.map((c: any) => c.answerName),
          color: colorPalette
        });
        break;

      default:
      // For any other types (Text, Rating, StarsRating), show column chart
    }
  }

}
