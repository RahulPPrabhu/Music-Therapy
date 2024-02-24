import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{
  message: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:5001/api/user', {
      withCredentials: true
    })
      .subscribe(
        (res: any) => {
          this.message = `Welcome ${res.name}`;
          Emitters.authEmitter.emit(true);
        },
        (err) => {
          this.message = "Login For Music Therapy!!";
          Emitters.authEmitter.emit(false);
        })
  }
}
