import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
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

  submit(): void {
    let user = this.form.getRawValue();

    if (user.email == "" || user.password == "") {
      this.toastr.error('Fields Empty', 'Error');
    }
    else if (!this.ValidateEmail(user.email)) {
      this.toastr.error("Enter valid email", "Error");
    }
    else {
      this.http.post("http://localhost:5001/api/login", user, {
        withCredentials: true
      })
        .subscribe(
          (res) => this.router.navigate(['/welcome'])
        , (err) => {
          this.toastr.error(err.error.message, "Error");
        })
    }
  }
}
