import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './modules/register/register.component';
import {FormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './modules/login/login.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import {MatIconModule} from "@angular/material/icon";
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { CredentialCardComponent } from './modules/credentialcard/credential-card.component';
import { SignoutComponent } from './modules/signout/signout.component';
import { CreateCredentialComponent } from './modules/createcredential/createcredential.component';
import { MasterPasswordDialogComponent } from './modules/master-password-dialog/master-password-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ImportPasswordComponent } from './modules/import-password/import-password.component';
import { ExportPasswordComponent } from './modules/export-password/export-password.component';
import { ConfirmDecisionComponent } from './modules/confirm-decision/confirm-decision.component';
import { ChooseFileTypeComponent } from './modules/export-password/choose-file-type/choose-file-type.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    CredentialCardComponent,
    SignoutComponent,
    CreateCredentialComponent,
    MasterPasswordDialogComponent,
    ImportPasswordComponent,
    ExportPasswordComponent,
    ConfirmDecisionComponent,
    ChooseFileTypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
