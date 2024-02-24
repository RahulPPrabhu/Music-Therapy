import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DisorderComponent } from './disorder/disorder.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'disorder', component: DisorderComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'song', component: SongComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
