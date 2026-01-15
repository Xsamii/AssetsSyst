import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

HC_more(Highcharts);
SolidGauge(Highcharts);

const color = [
  '#255E5D',
  '#16968C',
];
const piechartColors = [
  '#126560CC',
  '#16968C',
  '#0C588B99',
  '#0C588B66',
  '#15928833',
  '#146F691A',
];

// Half-circle gauge chart for large KPIs
export function halfGaugeChart({ ...data }) {
  Highcharts.chart(data['id'], {
    chart: {
      type: 'solidgauge',
      height: '100%',
      backgroundColor: 'transparent',
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0]
    },
    title: {
      text: data['titleText'] || '',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      enabled: false,
    },
    pane: {
      center: ['50%', '70%'],
      size: '80%',
      startAngle: -90,
      endAngle: 90,
      background: [{
        backgroundColor: '#E5E7EB',
        borderWidth: 0,
        outerRadius: '100%',
        innerRadius: '70%',
        shape: 'arc'
      }]
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -20,
          borderWidth: 0,
          useHTML: true,
          format: '<div style="text-align:center"><span style="font-size:25px;color:black">{y}%</span><br/>'
        },
        linecap: 'round',
        stickyTracking: false,
        rounded: true
      }
    },
    series: [{
      name: data['name'] || 'Progress',
      data: [{
        color: data['color'] || '#16968C',
        radius: '100%',
        innerRadius: '70%',
        y: data['value'] || 0
      }]
    }]
  } as any);
}

// Full-circle gauge chart for small KPIs
export function fullGaugeChart({ ...data }) {
  Highcharts.chart(data['id'], {
    chart: {
      type: 'solidgauge',
      height: '100%'
    },
    title: {
      text: data['titleText'] || '',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      enabled: false,
    },
    pane: {
      center: ['50%', '50%'],
      size: '100%',
      startAngle: 0,
      endAngle: 360,
      background: [{
        backgroundColor: '#E5E7EB',
        borderWidth: 0,
        outerRadius: '100%',
        innerRadius: '80%'
      }]
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -20,
          borderWidth: 0,
          useHTML: true,
          format: '<div style="text-align:center"><span style="font-size:18px;color:black">{y}%</span><br/>'
        },
        linecap: 'round',
        stickyTracking: false,
        rounded: true
      }
    },
    series: [{
      name: data['name'] || 'Progress',
      data: [{
        color: data['color'] || '#16968C',
        radius: '100%',
        innerRadius: '80%',
        y: data['value'] || 0
      }]
    }]
  } as any);
}

// Keep the original gauge function for backward compatibility
export function gaugeChart({ ...data }) {
  return halfGaugeChart(data);
}

// NEW: Special pie chart for top 4 dashboard charts with legend at bottom
export function pieChartWithBottomLegend({ ...data }) {
  const hasLegend = data['legend'] !== false;
  const spacingBottom = hasLegend ? 10 : 10;
  const marginBottom = hasLegend ? 110 : 10;
  const titleYOffset = hasLegend ? -25 : 0;

  const chart = Highcharts.chart(data['id'], {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      useHTML: true,
      spacingBottom: spacingBottom,
      marginBottom: marginBottom,
      height: null
    },
    credits: {
      enabled: false,
    },
    legend: {
      align: 'center',
      alignColumns: false,
      layout: 'horizontal',
      verticalAlign: 'bottom',
      rtl: true,
      useHTML: true,
      y: 10,
      itemMarginBottom: 5,
      itemMarginTop: 5,
      itemDistance: 15,
      symbolPadding: 5,
      symbolWidth: 10,
      symbolHeight: 10,
      itemStyle: {
        color: '#707070',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 'normal',
        fontFamily: 'Rubik',
      },
      enabled: hasLegend
    },
    title: {
      text: data['titleText']
        ? `<span id="dynamic-count-${data['id']}" style="font-size: 28px; font-weight: bold; color: #333;">${data['projectCount']}</span>`
        : '',
      align: 'center',
      verticalAlign: 'middle',
      useHTML: true,
      y: titleYOffset,
      x: 0,
      style: {
        textAlign: 'center'
      }
    },
    tooltip: {
      enabled: true,
      useHTML: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      borderRadius: 6,
      style: {
        color: 'white',
        fontSize: '12px',
        padding: '8px'
      },
      pointFormat: ' <br/>النسبة: {point.y:.1f}%'
    },
    accessibility: {
      point: {
        valueSuffix: '',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: hasLegend,
        point: {
          events: {
            mouseOver: function() {
              const countElement = document.getElementById(`dynamic-count-${data['id']}`);
              if (countElement) {
                countElement.innerHTML = this.y;
              }
            },
            mouseOut: function() {
              const countElement = document.getElementById(`dynamic-count-${data['id']}`);
              if (countElement) {
                countElement.innerHTML = data['projectCount'];
              }
            }
          }
        }
      },
    },
    colors: data['color'] ? data['color'] : piechartColors,
    series: [
      {
        name: '',
        colorByPoint: true,
        innerSize: '80%',
        data: data['seriesData'],
      },
    ],
  } as any);
}

// ORIGINAL pieChart function - legend on right side (OLD STYLE)
// export function pieChart({ ...data }) {
//   const hasLegend = data['legend'] !== false;

//   const chart = Highcharts.chart(data['id'], {
//     chart: {
//       plotBackgroundColor: null,
//       plotBorderWidth: null,
//       plotShadow: false,
//       type: 'pie',
//       useHTML: true,
//     },
//     credits: {
//       enabled: false,
//     },
//     legend: {
//       align: 'right',
//       verticalAlign: 'middle',
//       layout: 'vertical',
//       rtl: true,
//       useHTML: true,
//       itemStyle: {
//         color: '#707070',
//         cursor: 'pointer',
//         fontSize: '12px',
//         fontWeight: 'medium',
//         fontFamily: 'Rubik',
//       },
//       enabled: hasLegend
//     },
//      title: {
//       text: data['titleText']
//         ? `<div style="text-align: center;"><span id="dynamic-count-${data['id']}">${data['projectCount']}</span></div>`
//         : '',
//       align: 'center',
//       verticalAlign: 'middle',
//       useHTML: true,
//     },
//     tooltip: {
//       enabled: true,
//       useHTML: true,
//       backgroundColor: 'rgba(0,0,0,0.8)',
//       borderWidth: 0,
//       borderRadius: 6,
//       style: {
//         color: 'white',
//         fontSize: '12px',
//         padding: '8px'
//       },
//       pointFormat: ' <br/>النسبة: {point.y:.1f}%'
//     },
//     accessibility: {
//       point: {
//         valueSuffix: '',
//       },
//     },
//     plotOptions: {
//       pie: {
//         allowPointSelect: false,
//         cursor: 'pointer',
//         dataLabels: {
//           enabled: false,
//         },
//         showInLegend: data['legend'] !== false,
//         point: {
//           events: {
//             mouseOver: function() {
//               const countElement = document.getElementById(`dynamic-count-${data['id']}`);
//               if (countElement) {
//                 countElement.innerHTML = this.y;
//               }
//             },
//             mouseOut: function() {
//               const countElement = document.getElementById(`dynamic-count-${data['id']}`);
//               if (countElement) {
//                 countElement.innerHTML = data['projectCount'];
//               }
//             }
//           }
//         }
//       },
//     },
//     colors: data['color'] ? data['color'] : piechartColors,
//     series: [
//       {
//         name: '',
//         colorByPoint: true,
//         innerSize: '80%',
//         data: data['seriesData'],
//       },
//     ],
//   } as any);
// }
export function pieChart({ ...data }) {
  const chart = Highcharts.chart(data['id'], {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      useHTML: true,
    },
    credits: {
      enabled: false,
    },
    legend: {
      align: 'right',
      alignColumns: false,
      layout: 'Vertical',
      verticalAlign: 'top',
      rtl: true,
      useHTML: true,
      margin: '20px',
      itemStyle: {
        color: '#707070',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'medium',
        fontFamily: 'Rubik',
      },
      enabled: data['legend'] !== false
    },
    title: {
      text: data['titleText']
        ? `<div style="text-align: center;"><span id="dynamic-count-${data['id']}">${data['projectCount']}</span></div>`
        : '',
      align: 'center',
      verticalAlign: 'middle',
      useHTML: true,
    },
    tooltip: {
      enabled: true,
      useHTML: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      borderRadius: 6,
      style: {
        color: 'white',
        fontSize: '12px',
        padding: '8px'
      },
      pointFormat: ' <br/>النسبة: {point.y:.1f}%'
    },
    accessibility: {
      point: {
        valueSuffix: '',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: data['legend'] !== false,
        point: {
          events: {
            mouseOver: function() {
              const countElement = document.getElementById(`dynamic-count-${data['id']}`);
              if (countElement) {
                countElement.innerHTML = this.y;
              }
            },
            mouseOut: function() {
              const countElement = document.getElementById(`dynamic-count-${data['id']}`);
              if (countElement) {
                countElement.innerHTML = data['projectCount'];
              }
            }
          }
        }
      },
    },
    colors: data['color'] ? data['color'] : piechartColors,
    series: [
      {
        name: '',
        colorByPoint: true,
        innerSize: '80%',
        data: data['seriesData'],
      },
    ],
  } as any);
}



// Updated regular columnChart function with y-axis labels and scrollbar support
export function columnChart({ ...data }) {
 const categoryCount = data['categories'] ? data['categories'].length : 0;
 const minCategoriesForScroll = 10; // Show scrollbar if more than 10 categories
 const enableScrollbar = categoryCount > minCategoriesForScroll;

 // Calculate the width needed for comfortable viewing
 const minChartWidth = enableScrollbar ? categoryCount * 80 : undefined; // 80px per category for better spacing

 Highcharts.chart(data['id'], {
   chart: {
     type: 'column',
     panning: true,
     spacingLeft: 10,
     spacingRight: 10,
     marginLeft: 60, // Add larger margin for y-axis labels to always be visible
     marginBottom: 80, // Reduce bottom margin to minimize whitespace
     width: minChartWidth, // Set explicit width when scrolling is needed
     scrollablePlotArea: enableScrollbar ? {
       minWidth: minChartWidth,
       scrollPositionX: 1,
       minHeight: undefined
     } : undefined
   },
   credits: {
     enabled: false,
   },
   title: {
     text: data['titleText'] ? data['titleText'] : '',
     align: 'right',
     useHTML: true,
     style: {
       color: '#001219',
       fontWeight: '500',
       fontFamily: 'Rubik',
       fontSize: '14px',
     },
   },
   legend: {
     useHTML: true,
     enabled: false,
   },
   subtitle: {
     text: '',
     align: 'left',
   },
   xAxis: {
     categories: data['categories'] ? data['categories'] : [],
     panning: true,
     max: enableScrollbar ? 9 : undefined, // Show 10 categories at a time (0-9 index)
     crosshair: true,
     accessibility: {
     },
     reversed: true,
     lineWidth: 1, // Add line
     lineColor: '#e0e0e0',
     labels: {
       rotation: -90,
       y: 50,
       x: 0,
       align: 'center',
       useHTML: true,
       style: {
         fontSize: '14px',
         fontFamily: 'Rubik',
         textOverflow: 'none',
         whiteSpace: 'nowrap'
       },
       formatter: function() {
         const maxLength = 15;
         const label = this.value.toString();
         if (label.length > maxLength) {
           return label.substring(0, maxLength) + '...';
         }
         return label;
       }
     },
   },
   colors: data['color'] ? data['color'] : color,
   yAxis: {
     visible: true,
     showEmpty: true, // Always show y-axis even with no data
     min: 0, // Start from 0
     lineWidth: 1, // Show y-axis line
     lineColor: '#e0e0e0',
     gridLineWidth: 1,
     gridLineColor: '#f0f0f0',
     gridLineDashStyle: 'Solid',
     labels: {
       enabled: true, // Enable y-axis labels
       x: -25, // Position labels further to the left to prevent overlap
       style: {
         fontSize: '12px',
         fontFamily: 'Rubik',
         color: '#666'
       },
     },
     title: {
       text: '',
     },
     opposite: false, // Show on left side
   },
   tooltip: {
     useHTML: true,
     backgroundColor: 'rgba(0,0,0,0.8)',
     borderWidth: 0,
     borderRadius: 6,
     style: {
       color: 'white',
       fontSize: '12px',
       padding: '8px'
     },
     formatter: function() {
       return `<b>${this.x}</b><br/>${this.y}`;
     }
   },
   plotOptions: {
     column: {
       pointPadding: 0.15, // Reduce padding to make columns wider
       borderWidth: 0,
       borderRadius: 10,
       colorByPoint: true
     },
   },
   series: [
     {
       name: 'Data',
       data: data['seriesData'] ? data['seriesData'] : [],
     },
   ],
 } as any);
}

export function barsChart({ ...data }) {
  Highcharts.chart(data['id'], {
    chart: {
      type: 'bar',
      useHTML: true,
      animation: {
        duration: 500,
      },
      marginLeft: 100,
      marginRight: 50,
    },
    title: {
      text: '',
      align: 'left',
    },
    tooltip: {
      useHTML: true,
      enabled: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      borderRadius: 6,
      style: {
        color: 'white',
        fontSize: '12px',
        padding: '8px'
      },
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.y}%`;
      }
    },
    subtitle: {
      useHTML: true,
      text: '',
      floating: true,
      align: 'right',
      verticalAlign: 'middle',
      y: -80,
      x: -100,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      useHTML: true,
      type: 'category',
      categories: data['xAxisCategories'],
      labels: {
        useHTML: true,
        enabled: true, // تأكد إنها enabled
        align: 'right', // محاذاة على اليمين (الشمال بالنسبة للعربي)
        x: -10, // حرك الكلام شوية لليمين
        style: {
          color: '#333',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Rubik',
        },
      },
      lineWidth: 0,
    },
    colors: data['color'] ? data['color'] : ['#255E5D', '#16968C'],
    yAxis: {
      opposite: true,
      title: {
        text: null,
      },
      min: 0,
      max: 100,
      lineWidth: 0,
      gridLineWidth: 0,
      tickLength: 0,
      tickPixelInterval: undefined,
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0,
      labels: {
        enabled: false, // خلي أرقام الـ y-axis مخفية
      }
    },
    plotOptions: {
      bar: {
        borderRadius: '30%',
      },
      series: {
        pointWidth: 25,
        animation: false,
        groupPadding: 0,
        pointPadding: 0.1,
        borderWidth: 0,
        colorByPoint: true,
        dataSorting: {
          enabled: false,
          matchByName: true,
        },
        type: 'bar',
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: 'bar',
        name: '',
        data: data['seriesData'],
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 550,
          },
          chartOptions: {
            chart: {
              marginLeft: 80,
            },
            xAxis: {
              labels: {
                style: {
                  fontSize: '12px',
                }
              }
            },
            plotOptions: {
              series: {
                pointWidth: 20,
              },
            },
          },
        },
      ],
    },
  } as any);
}

export function lineCharts({ ...data }) {
  const categoryCount = data['xAxisCategories'].length;
  let rotation = 0;
  let marginBottom = 60;

  if (categoryCount > 15) {
    rotation = -45;
    marginBottom = 80;
  } else if (categoryCount > 10) {
    rotation = -30;
    marginBottom = 130;
  } else if (categoryCount > 6) {
    rotation = -15;
    marginBottom = 110;
  }

  Highcharts.chart(data['id'], {
    chart: {
      type: 'spline',
      useHTML: true,
      marginBottom: marginBottom,
      spacingBottom: 20,
    },
    title: {
      text: '',
      align: 'right',
      useHTML: true,
    },
    subtitle: {
      text: '',
      align: 'left',
    },
    tooltip: {
      useHTML: true,
      shared: true,
      crosshairs: true,
      formatter: function() {
        let tooltip = '<b>' + this.x + '</b><br/>';
        this.points.forEach(function(point) {
          tooltip += '<span style="color:' + point.color + '">' + point.series.name + ': <b>' + point.y + '</b></span><br/>';
        });
        return tooltip;
      }
    },
    colors: ['#1AAA55', '#FF9500'],
    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: '#f0f0f0',
    },
    xAxis: {
      categories: data['xAxisCategories'],
      labels: {
        rotation: rotation,
        align: rotation < 0 ? 'right' : 'center',
        style: {
          fontSize: '11px',
          fontFamily: 'Arial, sans-serif',
          color: '#666'
        },
        y: rotation === 0 ? 25 : (rotation === -15 ? 40 : (rotation === -30 ? 55 : 70)),
        x: rotation < 0 ? -8 : 0,
        formatter: function() {
          const label = String(this.value);
          if (label.length > 20) {
            return label.substring(0, 20) + '...';
          }
          return label;
        }
      },
      lineColor: '#ccc',
      tickColor: '#ccc',
      gridLineColor: '#f0f0f0',
      tickLength: 15,
    },
    credits: {
      enabled: false,
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      rtl: true,
      useHTML: true,
      itemStyle: {
        color: '#707070',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
      },
      symbolWidth: 20,
    },
    plotOptions: {
      spline: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4,
          states: {
            hover: {
              enabled: true,
              radius: 6,
            }
          }
        },
        states: {
          hover: {
            lineWidth: 4,
          }
        }
      },
      series: {
        label: {
          enabled: false,
          connectorAllowed: false,
        },
        animation: {
          duration: 1000
        }
      },
    },
    series: [
      {
        name: data['name1'],
        data: data['seriesData1'],
        visible: data['seriesData1'] && data['seriesData1'].length > 0,
      },
      {
        name: data['name2'],
        data: data['seriesData2'],
        visible: data['seriesData2'] && data['seriesData2'].length > 0,
      },
    ].filter(series => series.visible),
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
          },
          chartOptions: {
            xAxis: {
              labels: {
                rotation: -45,
                style: {
                  fontSize: '10px'
                },
                y: 70,
                x: -8,
                formatter: function() {
                  const label = String(this.value);
                  if (label.length > 15) {
                    return label.substring(0, 15) + '...';
                  }
                  return label;
                }
              },
              tickLength: 15,
            },
            chart: {
              marginBottom: Math.max(marginBottom, 170),
            },
            legend: {
              itemStyle: {
                fontSize: '12px',
              }
            }
          },
        },
        {
          condition: {
            maxWidth: 400,
          },
          chartOptions: {
            xAxis: {
              labels: {
                rotation: -60,
                style: {
                  fontSize: '9px'
                },
                y: 85,
                x: -10,
                formatter: function() {
                  const label = String(this.value);
                  if (label.length > 12) {
                    return label.substring(0, 12) + '...';
                  }
                  return label;
                }
              },
              tickLength: 18,
            },
            chart: {
              marginBottom: 200,
            },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  } as any);
}

// Helper function to create dropdown filter with selected value
function createDropdownFilter(chartId: string, options: any[], selectedValue?: any, onChangeCallback?: Function) {
  const chartContainer = document.getElementById(chartId);
  if (!chartContainer) {
    console.warn(`Chart container with id "${chartId}" not found`);
    return;
  }

  // Remove existing dropdown if any
  const existingDropdown = chartContainer.querySelector('.chart-dropdown-container');
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Create dropdown container
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'chart-dropdown-container';
  dropdownContainer.style.cssText = `
    position: absolute;
    top: -30px;
    left: 20px;
    z-index: 1000;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  // Create select element
  const select = document.createElement('select');
  select.className = 'chart-filter-dropdown';
  select.style.cssText = `
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 12px;
    color: #333;
    min-width: 140px;
    cursor: pointer;
    outline: none;
    font-family: Arial, sans-serif;
  `;

  // Add options
  options.forEach((option, index) => {
    const optionElement = document.createElement('option');

    // Handle both object format {value: x, label: y} and simple values
    let optionValue, optionLabel;

    if (typeof option === 'object' && option !== null) {
      optionValue = option.value;
      optionLabel = option.label;
    } else {
      optionValue = option;
      optionLabel = option;
    }

    optionElement.value = String(optionValue); // Ensure it's a string
    optionElement.textContent = String(optionLabel);

    // Set selected if this matches the selected value
    if (selectedValue !== undefined && (Number(optionValue) === Number(selectedValue))) {
      optionElement.selected = true;
    }

    select.appendChild(optionElement);
  });

  // Add change event listener
  select.addEventListener('change', (e) => {
    if (onChangeCallback) {
      onChangeCallback((e.target as HTMLSelectElement).value);
    }
  });

  dropdownContainer.appendChild(select);

  // Make chart container relative and add dropdown
  chartContainer.style.position = 'relative';
  chartContainer.style.overflow = 'visible';

  // Add dropdown as first child so it appears on top
  chartContainer.insertBefore(dropdownContainer, chartContainer.firstChild);

}

// Enhanced column chart with dropdown functionality
export function enhancedColumnChart({ ...data }) {
  // Create the chart first
  const chart = Highcharts.chart(data['id'], {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: {
        fontFamily: 'Arial, sans-serif'
      },
      spacingTop: data['showDropdown'] ? 60 : 20, // Add space for dropdown
      spacingLeft: 10, // Add more space on the left for y-axis labels
      spacingRight: 10,
      marginLeft: 45, // Increase left margin for y-axis labels
      marginBottom: 100, // Reduce bottom margin
    },
    credits: {
      enabled: false,
    },
    title: {
      text: data['titleText'] ? data['titleText'] : '',
      align: 'right',
      useHTML: true,
      style: {
        color: '#333',
        fontWeight: '600',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        marginBottom: '20px'
      },
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: data['categories'] ? data['categories'] : [],
      crosshair: false,
      lineWidth: 1,
      lineColor: '#e0e0e0',
      tickWidth: 1,
      tickColor: '#e0e0e0',
      labels: {
        rotation: -15,
        y: 20, // Reduce y position to bring labels closer
        x: -12,
        align: 'center',
        style: {
          fontSize: '16px',
          fontFamily: 'Rubik',
        },
      },
      gridLineWidth: 0
    },
    colors: data['color'] ? data['color'] : ['#16968C'],
    yAxis: {
      visible: true,
      min: 0,
      max: data['maxValue'] || 100,
      tickInterval: data['tickInterval'] || 20,
      lineWidth: 1,
      lineColor: '#e0e0e0',
      gridLineWidth: 1,
      gridLineColor: '#f0f0f0',
      gridLineDashStyle: 'Solid',
      labels: {
        enabled: true,
        x: -35, // Move labels more to the left
        style: {
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          color: '#666'
        },
        format: '{value}%'
      },
      title: {
        text: '',
      },
      opposite: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      borderRadius: 6,
      style: {
        color: 'white',
        fontSize: '12px',
        padding: '8px'
      },
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.y}%`;
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.15, // Reduce padding to make columns wider
        borderWidth: 0,
        borderRadius: 4,
        colorByPoint: false,
        color: data['color'] ? data['color'][0] : '#16968C',
        dataLabels: {
          enabled: data['showDataLabels'] || false,
        }
      },
    },
    series: [
      {
        name: 'البيانات',
        data: data['seriesData'] ? data['seriesData'] : [],
        showInLegend: false
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            xAxis: {
              labels: {
                rotation: -90,
                y: 35
              }
            },
            plotOptions: {
              column: {
                dataLabels: {
                  enabled: false
                }
              }
            }
          }
        }
      ]
    }
  } as any);

  // Create the dropdown AFTER the chart is rendered
  if (data['showDropdown']) {
    setTimeout(() => {
      createDropdownFilter(
        data['id'],
        data['dropdownOptions'] || [],
        data['selectedValue'], // Pass the selected value
        data['onDropdownChange']
      );
    }, 100);
  }

  return chart;
}
