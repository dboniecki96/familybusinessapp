import {Injectable} from '@angular/core';
import {User}       from './user.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const url = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isSignedIn: boolean;
  users: User[];
  user: User;

  constructor(private http: HttpClient) {
    this.users = [];
    this.isSignedIn = false;
  }

  getUsers() {
    return this.http.get<User[]>(`${url}/users`);
  }

  setUser(user: User): Observable<User> {
    return this.http.post<User>(`${url}/users`, user);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${url}/users/:` + id);
  }

  signInUser(form: any) {
    return this.http.post<any>(`${url}/login`, form);
  }

  isSignedin() {
    this.isSignedIn = true;
  }
}
