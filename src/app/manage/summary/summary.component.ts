import {Component}     from '@angular/core';
import {ManageService} from '../manage.service';
import {Group}         from '../group.model';
import {Expense}       from '../expense/expense.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  expenseGroups: Group[] = [];
  expenses: Expense[] = [];
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  isEnteredBudget = false;

  constructor(private manageService: ManageService) {
  }

  getBudget() {
    this.budget = this.manageService.getBudget();
  }
}
