import { Injectable } from '@angular/core';
import { Expense } from './expense/expense.model';
import { Group } from './group.model';
import {ManageComponent} from './manage.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map,filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  url = 'http://localhost:3000';
  posts: any;
  budget=0;
  expenseGroup: Group;
  expense: Expense;
  expenses: Expense[];
  expenseGroups: Group[];
  constructor(private http: HttpClient) { }
  getExpenseGroups() {
    return this.http.get<Group[]>(`${this.url}/expensesgroup`);
  }
  setExpenseGroups(group: Group,expenseGroup: Group[]){
    this.getExpenseGroups();
    if(expenseGroup.length > 1){
      expenseGroup.splice(expenseGroup.length-1,0,group);
    }
    if(expenseGroup.length === 0)
    {
      expenseGroup.push(group);
    }
    return this.http.post<Group[]>(`${this.url}/expensesgroup`,group);
  }
  deleteExpense(id: number){
    console.log('expense deleted from index '+ id);
    return this.http.delete(`${this.url}/expenses/`+id);
  }
  setExpenses(expense: Expense, expenses: Expense[]): Observable<Expense>{
    expenses.push(expense);
    return this.http.post<Expense>(`${this.url}/expenses`,expense);
  }
  getBudget(){
    return this.budget;
  }
  getExpenses(){
    return this.http.get(`${this.url}/expenses`);
  }
  setRest(){

  }
}
