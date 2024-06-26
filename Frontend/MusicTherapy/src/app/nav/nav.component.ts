import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  authenticated = false;

  constructor(private http:HttpClient) {}

  ngOnInit():void {
      Emitters.authEmitter.subscribe((auth:boolean) => {
        this.authenticated = auth;
      })
  }

  logout():void {
    this.http.post('http://localhost:5001/api/logout', {}, {withCredentials: true})
    .subscribe(() => this.authenticated = false)
  }
}
