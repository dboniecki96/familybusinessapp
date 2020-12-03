import {Component, Input} from '@angular/core';
import {Group}            from '../models/group.model';
import {NgForm}           from '@angular/forms';
import {AuthService}      from '../../auth/auth.service';
import {DashboardService} from '../dashboard.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html'
})
export class BudgetComponent {
  budget: number;
  @Input() expenseGroups: Group[];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
  }

  onAddExpenseGroup(f: NgForm) {
    const userID = this.authService.getUserID();
    const group: Group = {
      ...f.value,
      date: new Date().toISOString(),
      budget: this.budget,
      balance: this.budget * f.value.percentage / 100,
      userID
    };
    this.dashboardService.setExpenseGroups(group);
  }

  onDeleteExpenseGroup(index: number) {
    this.dashboardService.deleteExpenseGroups(index);
  }
}
