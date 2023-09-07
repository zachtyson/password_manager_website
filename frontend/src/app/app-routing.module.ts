import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./modules/register/register.component";
import {LoginComponent} from "./modules/login/login.component";
import {DashboardComponent} from "./modules/dashboard/dashboard.component";

const routes: Routes = [
  {path: 'register',component:RegisterComponent},
  {path: 'login',component:LoginComponent},
  {path: '',redirectTo: '/dashboard',pathMatch: 'full'},
  {path: 'dashboard',component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
