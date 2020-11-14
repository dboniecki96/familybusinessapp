import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Expense}                            from './expense/expense.model';
import {Group}                              from './group.model';
import {ManageService}                      from './manage.service';
import {User}                               from '../signup/user.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})

export class ManageComponent implements OnInit {
  date: Date;
  user: User;
  isAnyExpenseGroup = false;
  isEnteredBudget = false;
  isOddMoney = false;
  loggedUserID: number;
  expenseGroups: Group[] = []; //Tablica grup wydatkow
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  expenseGroupbalances: number[] = this.expenseGroups.map(a => a.balance); //Tablica przelicznikow grup wydatkow
  sumOfExpenseGroupBalances = 0; //Suma grup wydatkow
  expenses: Expense[] = []; //Tablica wydatkow
  expensebalances: number[] = this.expenses.map(a => a.sum); //Tablica ilosci danych wydatkow
  expenseGroupMoneyLeft: number[] = this.expenseGroups.map(a => a.moneyLeft); //Tablica pozostalosci w danej grupie wydatkow
  isExpenseChoiceVisible = false;
  names: string[] = this.expenseGroups.map(a => a.name);
  perc: number[] = this.expenseGroups.map(a => a.percentage);

  expensesSum = this.expensebalances.reduce((a: number, b: number) => a + b, 0);
  addForm: FormGroup;


  constructor(
    private manageService: ManageService,
  ) {
    for (let i = 0; i < this.expenseGroupMoneyLeft.length; i++) {
      this.expenseGroupMoneyLeft[i] = this.expenseGroupbalances[i] - this.expensesSum;
    }
  }

  ngOnInit() {
    this.manageService.getExpenseGroups().subscribe((expenseGroups: Group[]) => {
      this.expenseGroups = expenseGroups;
      this.budget = expenseGroups.filter(x => x.budget === this.budget);
      if (this.budget > 0) {
        this.isEnteredBudget = true;
      }

    });

    this.manageService.getExpenses().subscribe((expense: Expense[]) => {
      this.expenses = expense;
    });

    this.addForm = new FormGroup({
      expenseGroup: new FormControl(null, Validators.required),
      balance: new FormControl(null, Validators.required)
    });
  }

  onUpdateBudget(budget: number) {
    if (budget > 0) {
      this.budget = budget;
      for (let i = 0; i < this.expenseGroupbalances.length; i++) {
        this.expenseGroupbalances[i] = (this.budget * (+this.perc[i])) / 100;
      }
      this.isEnteredBudget = true;
    }
  }

  onDeleteExpenseGroup(index: number) {

    for (let i = 0; i < this.expenseGroupMoneyLeft.length; i++) {
      this.expenseGroupMoneyLeft[i] += this.expenseGroupbalances[index];
    }
    this.sumOfExpenseGroupBalances -= this.expenseGroupbalances[index];
    this.expenseGroups.filter((obj) => {
      if (obj.name === 'Odd Money' && obj.percentage < 100 && this.expenseGroups.length > 2) {
        this.expenseGroups.splice(index, 1);
        this.expenseGroupbalances.splice(index, 1);
        obj.balance += this.expenseGroupbalances[index];
        obj.percentage += this.perc[index];
      }
      if (obj.name !== 'Odd Money' && this.expenseGroups.length === 2) {
        this.expenseGroupbalances.length = 0;
        this.expenseGroups.length = 0;
        this.isOddMoney = false;
      }
    });
    this.isExpenseChoiceVisible = this.expenseGroups.length > 0;
  }

  onSaveExpenseGroup() {
    this.isAnyExpenseGroup = true;
  }

  onClearForm() {
    this.budget = null;
    this.expenseGroups = [];
  }

}
