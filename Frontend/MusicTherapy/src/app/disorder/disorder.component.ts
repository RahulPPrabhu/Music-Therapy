import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disorder',
  templateUrl: './disorder.component.html',
  styleUrls: ['./disorder.component.css']
})
export class DisorderComponent implements OnInit {
  Disordersrfc !: String;
  symptoms1 !: string;
  symptoms2 !: string;
  symptoms3 !: string;
  symptoms4 !: string;
  symptoms5 !: string;
  symptoms6 !: string;

  ngOnInit() {

  }
  
  constructor(private http: HttpClient, private toastr: ToastrService) {}

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
      },
      error: error => {
        console.log(error);
      }
    });
  }
}
