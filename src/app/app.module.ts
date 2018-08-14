import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ManageComponent } from './manage/manage.component';
import { AppRoutingModule } from './/app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { ExpenseComponent } from './manage/expense/expense.component';
import { SummaryComponent } from './manage/summary/summary.component';
import { ManageService } from './manage/manage.service';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule } from '@angular/material/form-field';
import { NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    ManageComponent,
    ExpenseComponent,
    SummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ScrollDispatchModule
  ],
  exports: [MatTabsModule],
  providers: [ManageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
