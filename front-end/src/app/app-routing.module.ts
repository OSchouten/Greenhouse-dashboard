import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ErrorComponent} from "./components/error/error.component";
import {LoginComponent} from "./components/login/login.component";
import {SensorsComponent} from "./components/sensors/sensors.component";
import {RegisterComponent} from "./components/register/register.component";
import {GroupsComponent} from "./components/groups/groups.component";
import {AuthenticationGuard} from "./guards/authentication/authentication.guard";
import {AddNoteComponent} from "./components/add-note/add-note.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {GraphsComponent} from "./components/graphs/graphs.component";
import {CreateGroupComponent} from "./components/create-group/create-group.component";
import {AdminCreateUserComponent} from "./components/admin-create-user/admin-create-user.component";
import {NoteComponent} from "./components/note/note.component";
import {TeamNotesComponent} from "./components/team-notes/team-notes.component";
import {SensorNoteComponent} from "./components/sensor-note/sensor-note.component";
import {ProgressReportComponent} from "./components/progress-report/progress-report.component";
import {AddTeamNoteComponent} from "./components/add-team-note/add-team-note.component";
import {AddSensorNoteComponent} from "./components/add-sensor-note/add-sensor-note.component";

const routes: Routes = [
  {path: 'note/team/create', component: AddTeamNoteComponent},
  {path: 'note/sensor/create/:sensorId/:string', component: AddSensorNoteComponent},
  {path: 'note/edit/team/:id', component: AddTeamNoteComponent},
  {path: 'note/edit/sensor/:id/:sensor', component: AddSensorNoteComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard]
  },
  {
    path: 'dashboard/notes/sensor/:identifier', component: SensorNoteComponent, canActivate: [AuthenticationGuard],
  },
  {
    path: 'note/:type/:id/:sensor', component: NoteComponent, canActivate: [AuthenticationGuard],
  },
  {
    path: 'note/:type/:id', component: NoteComponent, canActivate: [AuthenticationGuard],
  },
  {path: 'admin/dashboard', component: AdminCreateUserComponent, canActivate: [AuthenticationGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [AuthenticationGuard]},
  {path: 'groups/create', component: CreateGroupComponent, canActivate: [AuthenticationGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthenticationGuard]},
  {path: '', pathMatch: 'full', redirectTo: '/dashboard'},
  {path: 'login', component: LoginComponent},
  {
    path: 'sensors', component: SensorsComponent, canActivate: [AuthenticationGuard]
  },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'graphs', component: GraphsComponent, canActivate: [AuthenticationGuard]},
  {path: 'note', component: NoteComponent, canActivate: [AuthenticationGuard]},
  {path: 'addNoteTest', component: AddNoteComponent, canActivate: [AuthenticationGuard]},
  {path: 'progress-report', component: ProgressReportComponent, canActivate: [AuthenticationGuard]},
  {path: 'notes', component: TeamNotesComponent, canActivate: [AuthenticationGuard]},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
