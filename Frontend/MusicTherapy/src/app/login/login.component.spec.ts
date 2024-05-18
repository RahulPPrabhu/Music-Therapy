import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: any;
  let fixture: ComponentFixture<LoginComponent>;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [ ToastrService ]
    })
    .compileComponents();

    toastrService = TestBed.inject(ToastrService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email and password controls', () => {
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
  });

  it('should validate email format correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(component.ValidateEmail(validEmail)).toBeTrue();
    expect(component.ValidateEmail(invalidEmail)).toBeFalse();
  });

  it('should show error message for empty fields', () => {
    component.submit();
    expect(toastrService.error).toHaveBeenCalledWith('Fields Empty', 'Error');
  });

  it('should show error message for invalid email format', () => {
    component.form.patchValue({ email: 'invalid-email' });
    component.submit();
    expect(toastrService.error).toHaveBeenCalledWith('Enter valid email', 'Error');
  });

  it('should navigate to welcome page on successful login', () => {
    spyOn(component.http, 'post').and.returnValue(of({}));

    component.form.patchValue({ email: 'test@example.com', password: 'password' });
    component.submit();

    expect(component.router.navigate).toHaveBeenCalledWith(['/welcome']);
  });

  it('should show error message for login failure', () => {
    spyOn(component.http, 'post').and.returnValue(throwError({ error: { message: 'Login Failed' } })); // Mock login failure response

    component.form.patchValue({ email: 'test@example.com', password: 'password' });
    component.submit();

    expect(toastrService.error).toHaveBeenCalledWith('Login Failed', 'Error');
  });

  it('should navigate to welcome page for correct email format', () => {
    spyOn(component.http, 'post').and.returnValue(of({}));
  
    component.form.patchValue({ email: 'test@gmail.com', password: 'password' });
    component.submit();
  
    expect(toastrService.error).not.toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/welcome']);
  });
});
