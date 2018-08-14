import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ManageComponent } from './manage/manage.component';
import { SigninComponent } from './signin/signin.component';
import {SummaryComponent} from './manage/summary/summary.component';
import { ExpenseComponent } from './manage/expense/expense.component';
const routes: Routes = [
  {path: '',  redirectTo: 'signin', pathMatch:'full'},
  {path:'logout', redirectTo: 'signin',pathMatch: 'full'},
  {path: 'signup', component: SignupComponent},
  {path: 'manage', component: ManageComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'expense', component: ExpenseComponent},
  {path: 'summary/:id', component: SummaryComponent}
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)]
  ,exports: [RouterModule]
})
export class AppRoutingModule { }
