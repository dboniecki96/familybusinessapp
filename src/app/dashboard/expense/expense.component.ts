import {Component, Input} from '@angular/core';
import {Group}            from '../models/group.model';
import {Expense}          from '../models/expense.model';
import {NgForm}           from '@angular/forms';
import {DashboardService} from '../dashboard.service';
import {AuthService}      from '../../auth/auth.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  @Input() expenses: Expense[] = [];
  @Input() expenseGroups: Group[];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {
  }

  onAddExpense(addForm: NgForm) {
    const value = addForm.value;
    const expense: Expense = {
      ...value,
      sum: 1,
      expensegroupID: value.expenseGroup.id,
      date: new Date().toISOString(),
      userID: this.authService.getUserID()
    };
    this.dashboardService.setExpenses(expense);
  }

  deleteExpense(expenseId: number) {
    this.dashboardService.deleteExpense(expenseId);
  }
}
