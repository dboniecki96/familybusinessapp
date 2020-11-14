import {Component}     from '@angular/core';
import {Group}         from '../group.model';
import {Expense}       from './expense.model';
import {ManageService} from '../manage.service';
import {NgForm}        from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  loggedUserID: number;
  expenses: Expense[] = [];
  expenseGroups: Group[];
  sumOfExpenses = 0;
  addButtonVisible = false;
  expensesNames: string[];
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  isEnteredBudget = false;

  constructor(private manageService: ManageService) {
  }

  onAddExpense(addForm: NgForm) {
    const value = addForm.value;
    if (value.amount > 0 && value.expenseGroup) {
      const date = new Date().toLocaleDateString();
      this.expenseGroups.filter((group) => {
        if (group.name === value.expenseGroup && value.amount <= group.moneyLeft) {
          const newExpense = new Expense(this.expenses.length + 1, date, value.amount, this.loggedUserID, group.id);
          group.moneyLeft -= value.amount;
          this.sumOfExpenses += value.amount;
          this.manageService.setExpenses(newExpense, this.expenses);
        }
      });
      addForm.resetForm();
    }

  }

  onDeleteExpense(index: number) {
    const expenseAmounts = this.expenses.map(x => x.sum);
    const expensePositions = this.expenseGroups.map(x => x.name);
    this.expenseGroups.filter((group) => {
      if (group.name === expensePositions[index]) {
        index = group.id;
        group.moneyLeft += expenseAmounts[index];
        this.manageService.deleteExpense(index).subscribe(() => {
          this.expenses.splice(index + 1, 1);
        });
      }
    });
  }
}
