import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Emitters } from '../emitters/emitters';
import { of, throwError } from 'rxjs';

describe('WelcomeComponent', () => {
  let component: any;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize message as "Login For Music Therapy!!" on error', () => {
    spyOn(component.http, 'get').and.returnValue(throwError('HTTP Error'));
    component.ngOnInit();
    expect(component.message).toEqual('Login For Music Therapy!!');
  });

  it('should initialize message with welcome message on successful HTTP response', () => {
    const mockResponse = { name: 'John Doe' };
    spyOn(component.http, 'get').and.returnValue(of(mockResponse));
    component.ngOnInit();
    expect(component.message).toEqual(`Welcome ${mockResponse.name}`);
  });

  it('should emit true on successful HTTP response', () => {
    const spy = spyOn(Emitters.authEmitter, 'emit');
    spyOn(component.http, 'get').and.returnValue(of({ name: 'John Doe' }));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false on error', () => {
    const spy = spyOn(Emitters.authEmitter, 'emit');
    spyOn(component.http, 'get').and.returnValue(throwError('HTTP Error'));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
