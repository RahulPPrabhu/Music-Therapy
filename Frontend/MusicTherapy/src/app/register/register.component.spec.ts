import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let toastrService: ToastrService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ 
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(component.ValidateEmail(validEmail)).toBeTrue();
    expect(component.ValidateEmail(invalidEmail)).toBeFalse();
  });

  it('should show error message when form fields are empty', () => {
    spyOn(toastrService, 'error');
    component.submit();
    expect(toastrService.error).toHaveBeenCalledWith('Fields Empty', 'Error');
  });

  it('should show error message for invalid email', () => {
    spyOn(toastrService, 'error');
    component.form.patchValue({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password',
      dob: '1990-01-01',
      occupation: 'Developer',
      gender: 'male'
    });
    component.submit();
    expect(toastrService.error).toHaveBeenCalledWith('Enter valid email', 'Error');
  });
});
