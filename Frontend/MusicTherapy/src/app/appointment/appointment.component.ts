import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  therapist !: any;
  email !: String;
  name !: string;
  therapistName !: string

  therapists = [
    { specialization: 'Depression' },
    { specialization: 'Depression' },
    { specialization: 'Depression' },
    { specialization: 'Anxiety' },
    { specialization: 'Anxiety' },
    { specialization: 'Anxiety' }
  ];

  therapistDetails: any[] = []

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getTherapistDetails();
    this.getTherapistStatus();
  }

  getTherapistDetails(): void {
    this.http.get('http://localhost:5001/api/userDetails', { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.email = response.email;
          this.name = response.name ? response.name : 'Name not available';
          console.log(`The email of the current logged in user is ${this.email}`);
          console.log(`The user name is ${this.name}`);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  getTherapistStatus(): void {
    this.http.get<any[]>('http://localhost:5001/api/therapistStatus')
      .subscribe(
        (response: any[]) => {
          console.log(response);
          this.therapistDetails = response;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  assignStatus(therapist: any): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let appointmentDateString: any;
    let appointmentDate: any;

    if (!(currentHour >= 19 || currentHour < 12)) {
      this.toastr.error("Bookings can only be made between 7PM and 12PM (noon) the next day", "Error", {
        progressBar: true
      });
      return;
    }

    if (currentHour >= 19 && currentHour < 24) {
      appointmentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      appointmentDateString = appointmentDate.toISOString().substring(0, 10);
    } else {
      appointmentDate = currentDate;
      appointmentDateString = appointmentDate.toISOString().substring(0, 10);
    }
    therapist.status = 'Assigned';
    this.http.put(`http://localhost:5001/api/therapistStatus/${therapist.therapistName}`, therapist)
      .subscribe(
        (response) => {
          this.therapistName = therapist.therapistName
          console.log(this.therapistName)
          console.log(response);
          this.toastr.success("Appointment Successfull", "Done", {
            progressBar: true
          });

          this.http.post('http://localhost:5001/api/confirmAppointment', { email: this.email, name: this.therapistName, date: appointmentDateString })
            .subscribe(
              (response) => {
                console.log(this.email)
                console.log(this.therapistName)
                console.log(appointmentDateString)
                console.log(response);
                this.toastr.success("Check Mail for Appointment", "Success", {
                  progressBar: true,
                  progressAnimation: 'decreasing'
                })
              }
            )

          setTimeout(() => {
            therapist.status = 'Available';
            this.http.put(`http://localhost:5001/api/therapistStatus/${therapist.therapistName}`, therapist)
              .subscribe(
                (response) => {
                  console.log(response);
                },
                (err) => {
                  console.error(err);
                }
              );
          }, 20000);
        },
        (err) => {
          console.error(err);
        }
      );
  }

}
