import { Injectable } from '@angular/core';
import {User} from './user.model';
import { SignupComponent } from './signup.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { users } from './mock-user.model';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000';
  isSignedIn = false;
  users: User[]= [];
  user: User;
  constructor(private http: HttpClient) { }
  getUsers(){
    return this.http.get<User[]>(`${this.url}/users`);
  }
  setUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/users`,user);
    // this.users.push(user);
  }
  getUserById(id: number){
    return this.http.get<User>(`${this.url}/users/:`+ id);
  }
  signInUser(id: number){
    return this.http.post<User>(`${this.url}/users/:`,id);
  }
  isSignedin(){
    this.isSignedIn = true;
  }
}
