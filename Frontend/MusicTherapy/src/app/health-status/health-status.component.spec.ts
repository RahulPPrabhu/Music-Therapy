import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HealthStatusComponent } from './health-status.component';
import { Chart } from 'chart.js';

describe('HealthStatusComponent', () => {
  let component: HealthStatusComponent;
  let fixture: ComponentFixture<HealthStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthStatusComponent],
      imports: [FormsModule] // Include FormsModule in imports array
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create a bar chart with valid options', () => {
    const selectedOptions = {
      score: 8,
      mood: 9,
      music: 7,
      stress: 6,
      health: 8
    };

    component.selectedOptions = selectedOptions;
    component.ngAfterViewInit();

    const chartData = component.chart?.data?.datasets?.[0]?.data;
    const chartLabels = component.chart?.data?.labels;

    expect(component.chart).toBeDefined();
    expect(chartData).toEqual([selectedOptions.score, selectedOptions.mood, selectedOptions.music, selectedOptions.stress, selectedOptions.health]);
    expect(chartLabels).toEqual(['Music Effectiveness', 'Mood', 'Concentration', 'Stress Relief', 'Health']);
    expect(component.chart instanceof Chart).toBeTruthy();
  });
});
