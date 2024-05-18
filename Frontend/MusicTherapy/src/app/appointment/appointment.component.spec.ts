import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { AppointmentComponent } from './appointment.component';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ToastrService],
      declarations: [AppointmentComponent]
    });

    component = TestBed.createComponent(AppointmentComponent).componentInstance;
    toastrService = TestBed.inject(ToastrService);
  });

  it('should show error message for invalid booking time', () => {
    spyOn(toastrService, 'error');

    // Simulate a booking attempt outside valid hours
    component.assignStatus({ therapistName: 'Dr. Smith', status: 'Available' });

    // Check that the error message is shown
    expect(toastrService.error).toHaveBeenCalledWith(
      'Bookings can only be made between 7PM and 12PM (noon) the next day',
      'Error',
      { progressBar: true }
    );
  });

  it('should show success message for successful appointment booking', () => {
    spyOn(toastrService, 'success');

    // Simulate a successful appointment booking
    component.assignStatus({ therapistName: 'Dr. Johnson', status: 'Available' });

    // Check that the success message is shown
    expect(toastrService.success).toHaveBeenCalledWith(
      'Appointment Successfull',
      'Done',
      { progressBar: true }
    );
  });
});
