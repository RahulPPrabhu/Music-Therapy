import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  disorders: any[] = [];
  song !: string;
  id !: String;
  name !: string;
  youtubeUrl: SafeResourceUrl;
  recommendations: any;
  recommendedSong: any;
  email: string;
  selectedHr: any = null;
  selectedMin: any = null;
  selectedAmPm: any = null;

  private API_URL = 'http://localhost:5001/api/disorder';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.http.get('http://localhost:5001/api/userDetails', { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.email = response.email;
          this.name = response.name; // Store the name in the component's property
          console.log(`The email of the current logged in user is ${this.email}`);
          console.log(`The name of the current logged in user is ${this.name}`);
        },
        error: (err) => {
          console.log(err);
        }
      });

    this.http.get<any[]>(this.API_URL, { withCredentials: true }).subscribe(
      data => {
        this.disorders = data;
        if (this.disorders.length > 0) {
          const latestDisorder = this.disorders[this.disorders.length - 1];
          this.song = this.songSuggestion(latestDisorder.disorder);
          console.log(this.song);
          this.email = latestDisorder.email;
          console.log(this.email)
          console.log(latestDisorder.disorder)
          this.fetchVideoId(this.song);
        }
        else {
          console.log("No data Found!!!")
        }
      },
      error => {
        console.log('Error:', error);
      }
    );
    console.log(this.selectedHr);
  }

  onSongSelect(song: string): void {
    console.log(song);
    this.fetchVideoId(song);
  }

  OnSubmit(form: NgForm) {

    console.log(this.selectedHr, this.selectedMin, this.selectedAmPm);

    const now = new Date();

    let appointmentDate = new Date();
    appointmentDate.setHours(this.selectedHr, this.selectedMin, 0, 0);

    if (appointmentDate < now) {
      appointmentDate.setDate(appointmentDate.getDate() + 1);
    }

    const appointmentDateString = appointmentDate.toISOString().substring(0, 10);

    if (!this.selectedHr || !this.selectedMin || !this.selectedAmPm) {
      this.toastr.error("Please Fill all the details", "Missing Fields")
    }
    else {
      this.toastr.success("Scheduled Successfully", "Done", {
        progressBar: true
      });
      const url = 'http://localhost:5001/api/sendEmail';
      const body = {
        email: this.email,
        hour: this.selectedHr,
        minute: this.selectedMin,
        ampm: this.selectedAmPm,
        date: appointmentDateString
      };
      this.http.post(url, body).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });
    }
  }


  songSuggestion(disorder: string): string {
    let song = '';
    if (disorder === "Social Anxiety Disorder(SAD)") {
      song = "vampire"
    }
    else if (disorder === "Panic Disorder(PD)") {
      song = "golden hour"
    }
    else if (disorder === "Generalized anxiety disorder(GAD)") {
      song = "Die For You - Remix"
    }
    else if (disorder === "Major Depression") {
      song = "Bones"
    }
    else if (disorder === "Manic Disorder") {
      song = "Rush"
    }
    else if (disorder === "Persistent Depressive Disorder") {
      song = "Demons"
    }

    this.http.post('http://localhost:5000/predict', { song: song }).subscribe(
      data => {
        console.log(data);
        this.recommendations = data;
      },
      error => {
        console.log(error);
      }
    );
    console.log(song);
    return song;
  }

  async fetchVideoId(songName: string): Promise<void> {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songName}+lyrical&key=AIzaSyAUfjzmBAvTURLpH3rUiRVgtcO7mvJ_qfo`);
    const data = await response.json();
    const items = data.items;
    if (items.length > 0) {
      this.id = items[0].id.videoId;
      this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.id}`);
    }
  }
}