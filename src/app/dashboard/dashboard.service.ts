import {Injectable}                  from '@angular/core';
import {Expense}                     from './models/expense.model';
import {Group}                       from './models/group.model';
import {HttpClient, HttpHeaders}     from '@angular/common/http';
import {url}                         from '../auth/signup/user.service';
import {AuthService}                 from '../auth/auth.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  expensesSubject: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  expenseGroupsSubject: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);

  userID: number;
  tokenHeader: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userID = this.authService.getUserID();
    const token = this.authService.getToken();
    if (token) {
      this.tokenHeader = new HttpHeaders({
        'Auth-Token': token
      });
    }
  }

  /*** EXPENSES ***/

  getExpenses(): Observable<Expense[]> {
    this.http.get<Expense[]>(`${url}/expenses/${this.userID}`, {
      headers: this.tokenHeader
    }).subscribe(expenses => this.expensesSubject.next(expenses));
    return this.expensesSubject.asObservable();
  }

  setExpenses(expense: Expense): void {
    this.http.post(`${url}/expenses`, expense, {
      headers: this.tokenHeader,
      responseType: 'text'
    }).subscribe(() => this.getExpenses());
  }

  deleteExpense(id: number): void {
    this.http.delete(`${url}/expenses/${id}`, {
      headers: this.tokenHeader
    }).subscribe(() => this.getExpenses());
  }

  /*** EXPENSE GROUPS ***/

  getExpenseGroups(): Observable<Group[]> {
    this.http.get<Group[]>(`${url}/expensesgroup/${this.userID}`, {
      headers: this.tokenHeader,
    }).subscribe(groups => {
      this.expenseGroupsSubject.next(groups);
    });
    return this.expenseGroupsSubject.asObservable();
  }

  setExpenseGroups(group: Group): void {
    this.http.post(`${url}/expensesgroup`, group, {
      headers: this.tokenHeader,
      responseType: 'text'
    }).subscribe(() => this.getExpenseGroups());
  }

  deleteExpenseGroups(index: number): void {
    this.http.delete(`${url}/expensesgroup/${index}`, {
      responseType: 'text',
      headers: this.tokenHeader
    }).subscribe(() => this.getExpenseGroups());
  }
}
