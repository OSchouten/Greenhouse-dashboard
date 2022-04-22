import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MarkdownModule} from 'ngx-markdown';

import {NavbarComponent} from "./components/navbar/navbar.component";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ErrorComponent} from './components/error/error.component';
import {RegisterComponent} from './components/register/register.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {LoginComponent} from "./components/login/login.component";
import {SensorsComponent} from './components/sensors/sensors.component';
import {SensorComponent} from "./components/sensors/sensor/sensor.component";
import {GroupsComponent} from './components/groups/groups.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddNoteComponent} from './components/add-note/add-note.component';
import {ProfileComponent} from './components/profile/profile.component';
import {SettingsComponent} from './components/settings/settings.component';
import {DragulaModule} from "ng-dragula";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GraphsComponent} from './components/graphs/graphs.component';
import {GoogleChartsModule} from "angular-google-charts";
import {CreateGroupComponent} from './components/create-group/create-group.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AdminCreateUserComponent} from './components/admin-create-user/admin-create-user.component';
import {FormsModule} from "@angular/forms";
import {NoteComponent} from './components/note/note.component';
import {AuthSbHttpInterceptorService} from "./services/auth/auth-sb-http-interceptor.service";
import {ProgressReportComponent} from './components/progress-report/progress-report.component';
import { NotesComponent } from './components/notes/notes.component';
import { TeamNotesComponent } from './components/team-notes/team-notes.component';
import { FilterComponent } from './components/filter/filter.component';
import { SensorNoteComponent } from './components/sensor-note/sensor-note.component';
import { AddTeamNoteComponent } from './components/add-team-note/add-team-note.component';
import {LMarkdownEditorModule} from "ngx-markdown-editor";
import { AddSensorNoteComponent } from './components/add-sensor-note/add-sensor-note.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ErrorComponent,
    RegisterComponent,
    SidebarComponent,
    LoginComponent,
    SensorsComponent,
    SensorComponent,
    GroupsComponent,
    AddNoteComponent,
    ProfileComponent,
    SettingsComponent,
    GraphsComponent,
    CreateGroupComponent,
    AdminCreateUserComponent,
    NoteComponent,
    ProgressReportComponent,
    NotesComponent,
    TeamNotesComponent,
    FilterComponent,
    SensorNoteComponent,
    AddTeamNoteComponent,
    AddSensorNoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragulaModule,
    HttpClientModule,
    GoogleChartsModule,
    FontAwesomeModule,
    LMarkdownEditorModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthSbHttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
