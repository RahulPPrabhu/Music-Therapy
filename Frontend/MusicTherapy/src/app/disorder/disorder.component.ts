import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disorder',
  templateUrl: './disorder.component.html',
  styleUrls: ['./disorder.component.css']
})
export class DisorderComponent implements OnInit {
  title = 'Disease prediction';
  email !: String;
  name !: string;
  Disordersrfc !: String;
  symptoms1 !: string;
  symptoms2 !: string;
  symptoms3 !: string;
  symptoms4 !: string;
  symptoms5 !: string;
  symptoms6 !: string;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
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

  change(event: any) {
    this.symptoms1 = event.target.value;
    console.log(this.symptoms1);
  }
  change1(event: any) {
    this.symptoms2 = event.target.value;
    console.log(this.symptoms2);
  }
  change2(event: any) {
    this.symptoms3 = event.target.value;
    console.log(this.symptoms3);
  }
  change3(event: any) {
    this.symptoms4 = event.target.value;
    console.log(this.symptoms4);
  }
  change4(event: any) {
    this.symptoms5 = event.target.value;
    console.log(this.symptoms5);
  }
  change5(event: any) {
    this.symptoms6 = event.target.value;
    console.log(this.symptoms6);
  }

  OnSubmit(form: NgForm) {
    const symptoms = [
      this.symptoms1,
      this.symptoms2,
      this.symptoms3,
      this.symptoms4,
      this.symptoms5,
      this.symptoms6
    ];
  
    this.http.post('http://localhost:3300/predict', {symptoms: symptoms}).subscribe({
      next: (response: any) => {
        this.toastr.success("Successfully Predicted", "Done", {
          progressBar: true
        });
        this.Disordersrfc = response.disorder_rfc;
  
        this.http.post('http://localhost:5001/api/storeDisorder', {
            disorder: this.Disordersrfc,
            email: this.email,
          }).subscribe({
            next: (response: any) => {
              console.log('Stored In Mongo');
              this.toastr.success("Go to Therapy section", "Done", {
                progressBar: true
              });
            },
            error: err => {
              console.log('Error Storing Data', err);
            }
          });
      },
      error: error => {
        console.log(error);
      }
    });
  }
}  
