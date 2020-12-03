import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent}      from './auth/signup/signup.component';
import {SigninComponent}      from './auth/signin/signin.component';
import {AuthGuard}            from './auth/auth.guard';
import {DashboardComponent}   from './dashboard/dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'signin', pathMatch: 'full'},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})
  ],
  providers: [
    AuthGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
