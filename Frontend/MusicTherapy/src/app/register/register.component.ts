import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router:Router, private toastr: ToastrService){}

    ngOnInit():void {
      this.form = this.formBuilder.group({
          name: '',
          email: '',
          password: '',
          dob: '',
          occupation: '',
          gender: ''
      });
    }

    ValidateEmail = (email: any) => {
      var validRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
      if(email.match(validRegex)) {
        return true;
      }
      else{
        return false;
      }
    }

    submit(): void{
      let user = this.form.getRawValue();
      console.log(user);

      if (user.name == "" || user.email == "" || user.password == "" || user.dob == "" || user.occupation == "", user.gender == "") {
        this.toastr.error('Fields Empty', 'Error');
      }
      else if(!this.ValidateEmail(user.email)) {
          this.toastr.error("Enter valid email", "Error");
      }
      else {
        this.http.post("http://localhost:5001/api/register",user, {
          withCredentials: true
        })
        .subscribe(() => {
          this.toastr.success("Registration Successful", "Success");
          this.router.navigate(['/'])
        },(err) => {
          this.toastr.error(err.error.message, "Error");
        })
      }
    }
}
