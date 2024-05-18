import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { DisorderComponent } from './disorder.component';

describe('DisorderComponent', () => {
  let component: any;
  let fixture: ComponentFixture<DisorderComponent>;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, ToastrModule.forRoot()],
      declarations: [DisorderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisorderComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'error');
    fixture.detectChanges();
  });

  it('should predict disorder when all symptoms are selected', () => {
    spyOn(component.http, 'post').and.returnValue(of({ disorder_rfc: 'Anxiety Disorder' }));

    component.symptoms1 = 'Restless';
    component.symptoms2 = 'Fatigued';
    component.symptoms3 = 'Difficulty Concentrating';
    component.symptoms4 = 'Irritable';
    component.symptoms5 = 'Headaches';
    component.symptoms6 = 'Unexplained Pains';
    component.OnSubmit({} as NgForm);

    expect(toastrService.error).not.toHaveBeenCalled();
    expect(component.Disordersrfc).toBe('Anxiety Disorder');
    expect(component.http.post).toHaveBeenCalledTimes(2);
  });
});
