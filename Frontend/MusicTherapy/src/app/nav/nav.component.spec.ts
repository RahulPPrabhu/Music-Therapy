import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Emitters } from '../emitters/emitters';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: any;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with authenticated set to false', () => {
    expect(component.authenticated).toBeFalse();
  });

  it('should update authenticated property on authentication change event', () => {
    Emitters.authEmitter.next(true);
    expect(component.authenticated).toBeTrue();
  });

  it('should logout and update authenticated property to false', () => {
    spyOn(component.http, 'post').and.returnValue({ subscribe: () => {} });
    component.logout();
    expect(component.authenticated).toBeFalse();
  });
});
