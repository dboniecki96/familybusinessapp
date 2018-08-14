import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './signup/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  url = 'http://localhost:3000';
  usersUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }
  getRoot(){
    return this.http.get(this.url);
  }
  getUsers(){
    return this.http.get<User>(this.usersUrl);
  }
}
