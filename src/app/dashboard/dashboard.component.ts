import {Component, OnInit} from '@angular/core';
import {Expense}           from './models/expense.model';
import {Group}             from './models/group.model';
import {DashboardService}  from './dashboard.service';
import {Observable}        from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  expenseGroups$: Observable<Group[]>;
  expenses$: Observable<Expense[]>;

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  ngOnInit() {
    this.expenses$ = this.dashboardService.getExpenses();
    this.expenseGroups$ = this.dashboardService.getExpenseGroups();
  }
}
