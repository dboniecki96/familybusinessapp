import { Component, OnInit } from '@angular/core';
import { Group } from '../group.model';
import { Expense } from './expense.model';
import { ManageService } from '../manage.service';
import { NgForm, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../signup/user.service';
import { User } from '../../signup/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  isMoneyLeftLow = false;
  loggedUserID: number;
  expenses: Expense[]=[];
  expenseGroups: Group[];
  sumOfExpenses = 0;
  addButtonVisible = false;
  expensesNames: string[];
  addForm: FormGroup;
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  // expenseNames = this.expenseGroups.map(x=>x.name);
  isEnteredBudget = false;

  constructor(private manageService: ManageService, private http: HttpClient, private userService: UserService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.manageService.getExpenseGroups().subscribe((expenseGroups: Group[])=>{
      this.expenseGroups = expenseGroups;
      this.budget = expenseGroups.filter(x=>x.budget === this.budget);
      if(this.budget>0){
        this.isEnteredBudget=true;
        console.log(this.isEnteredBudget);
      }
    });
    this.manageService.getExpenses().subscribe((expenses: Expense[])=>{
      this.expenses = expenses;
    });
    this.userService.getUserById(this.loggedUserID).subscribe((user: User)=>{
      this.route.paramMap.subscribe(params=>{
      this.loggedUserID = parseInt(params.get('id'));
        console.log(this.loggedUserID);
    });
    });
    
  }

  onAddExpense(addForm: NgForm){
    const value = addForm.value;
    if(value.amount >0 && value.expenseGroup !== null){
      let date = new Date().toLocaleDateString();
      this.expenseGroups.filter((group)=>{
        if(group.name === value.expenseGroup && value.amount<=group.money_left){
          const newExpense = new Expense(this.expenses.length+1,date,value.amount,this.loggedUserID,group.id);
          console.log(newExpense);
           group.money_left-=value.amount;
           this.sumOfExpenses+=value.amount;
           this.manageService.setExpenses(newExpense,this.expenses).subscribe(res=>{
              console.log(res);
           });
           console.log(Expense);
           console.log(Group);
          }
      });
      addForm.resetForm();
    }
    
  }
  onDeleteExpense(index: number){
    let expenseAmount = this.expenses.map((x)=>{return x.sum})
    let expensePosition = this.expenseGroups.map((x)=>{return x.name});
    this.expenseGroups.filter((group)=>{
      if(group.name === expensePosition[index]){
        index = group.id;
        group.money_left+=expenseAmount[index];
        this.manageService.deleteExpense(index).subscribe(data=>{
          this.expenses.splice(index+1,1);
        });
        console.log(expenseAmount[index]);
       }
   });
    console.log('deleted');
  }

}
