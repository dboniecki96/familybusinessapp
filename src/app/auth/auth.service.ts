import {Injectable}      from '@angular/core';
import {UserService}     from './signup/user.service';
import {Router}          from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userIDSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.getUserID());
  isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  getUserID(): number {
    return +sessionStorage.getItem('USER_ID');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('SESSIONID');
  }

  getToken() {
    return sessionStorage.getItem('SESSIONID');
  }

  setUserID(id: number): void {
    this.userIDSubject.next(id);
  }

  logoutUser() {
    sessionStorage.clear();
    this.isAuthSubject.next(this.isLoggedIn());
    this.router.navigate(['/signin']).then(null);
  }

  authenticateUser(form: any): void {
    this.userService.signInUser(form).subscribe(res => {
      this.setUserID(res.body.userID);
      const token = res.headers.get('Auth-Token');
      sessionStorage.setItem('USER_ID', res.body.userID);
      sessionStorage.setItem('SESSIONID', token);
      this.router.navigate(['/dashboard']).then(null);
    }, () => {
    }, () => {
      this.isAuthSubject.next(this.isLoggedIn());
    });
  }
}
