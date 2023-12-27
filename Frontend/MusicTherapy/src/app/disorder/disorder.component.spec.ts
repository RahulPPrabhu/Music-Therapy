import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisorderComponent } from './disorder.component';

describe('DisorderComponent', () => {
  let component: DisorderComponent;
  let fixture: ComponentFixture<DisorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisorderComponent]
    });
    fixture = TestBed.createComponent(DisorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
