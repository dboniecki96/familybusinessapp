import {BrowserModule}                    from '@angular/platform-browser';
import {NgModule}                         from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent}                     from './app.component';
import {HeaderComponent}                  from './header/header.component';
import {SigninComponent}                  from './auth/signin/signin.component';
import {SignupComponent}                  from './auth/signup/signup.component';
import {DashboardComponent}      from './dashboard/dashboard.component';
import {AppRoutingModule}        from './app-routing.module';
import {HttpClientModule}        from '@angular/common/http';
import {ExpenseComponent}        from './dashboard/expense/expense.component';
import {SummaryComponent}        from './dashboard/summary/summary.component';
import {DashboardService}        from './dashboard/dashboard.service';
import {MatDatepickerModule}     from '@angular/material/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule}      from '@angular/material/form-field';
import {MatNativeDateModule}     from '@angular/material/core';
import {MatTabsModule}           from '@angular/material/tabs';
import {BudgetComponent}         from './dashboard/budget/budget.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    ExpenseComponent,
    DashboardComponent,
    SummaryComponent,
    BudgetComponent
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
  ],
  exports: [MatTabsModule],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
