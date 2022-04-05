import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup-signin/signup/signup.component';
import { SigninComponent } from './signup-signin/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaxpDashboardComponent } from './dashboard/taxp-dashboard/taxp-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { TaxacDashboardComponent } from './dashboard/taxac-dashboard/taxac-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: 'dashboard/taxp', component: TaxpDashboardComponent },
  { path: 'dashboard/taxac', component: TaxacDashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HomeComponent,
    TaxpDashboardComponent,
    AdminDashboardComponent,
    TaxacDashboardComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
