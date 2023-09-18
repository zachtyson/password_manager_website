import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./modules/register/register.component";
import {LoginComponent} from "./modules/login/login.component";
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {SignoutComponent} from "./modules/signout/signout.component";
import {CreateCredentialComponent} from "./modules/createcredential/createcredential.component";
import {ImportPasswordComponent} from "./modules/import-password/import-password.component";
import {ExportPasswordComponent} from "./modules/export-password/export-password.component";

const routes: Routes = [
  {path: 'register',component:RegisterComponent},
  {path: 'login',component:LoginComponent},
  {path: '',redirectTo: '/dashboard',pathMatch: 'full'},
  {path: 'dashboard',component:DashboardComponent},
  {path: 'signout',component:SignoutComponent},
  {path: 'logout',redirectTo: '/signout',pathMatch: 'full'},
  {path: 'create-credential',component:CreateCredentialComponent,pathMatch: 'full'},
  {path: 'import-password',component:ImportPasswordComponent,pathMatch: 'full'},
  {path: 'export-password',component:ExportPasswordComponent,pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
