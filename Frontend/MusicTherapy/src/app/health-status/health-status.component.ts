import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-health-status',
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.css']
})
export class HealthStatusComponent implements AfterViewInit  {
  selectedOptions: any = {};
  chart:any;
  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngAfterViewInit(): void {
    this.createBarChart();
  }

  createBarChart(): void {
    const ctx = this.barChart.nativeElement.getContext('2d');
    console.log(this.selectedOptions)
    if (ctx === null) {
      console.error('Could not get 2D context for chart');
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Music Effectiveness', 'Mood', 'Concentration', 'Stress Relief', 'Health'],
        datasets: [{
          label: 'Health Status',
          data: [
            this.selectedOptions.score || 0,
            this.selectedOptions.mood || 0,
            this.selectedOptions.music || 0,
            this.selectedOptions.stress || 0,
            this.selectedOptions.health || 0
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // red
            'rgba(54, 162, 235, 0.2)', // blue
            'rgba(255, 206, 86, 0.2)', // yellow
            'rgba(75, 192, 192, 0.2)', // green
            'rgba(153, 102, 255, 0.2)' // purple
          ],          
          borderColor: [
            'rgba(255, 99, 132, 1)', // red
            'rgba(54, 162, 235, 1)', // blue
            'rgba(255, 206, 86, 1)', // yellow
            'rgba(75, 192, 192, 1)', // green
            'rgba(153, 102, 255, 1)' // purple
          ],          
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
