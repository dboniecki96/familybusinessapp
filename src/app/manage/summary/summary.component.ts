import { Component, OnInit } from '@angular/core';
import {ManageService} from '../manage.service';
import {Group} from '../group.model';
import { UserService } from '../../signup/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../signup/user.model';
import { Observable } from 'rxjs';
import { Expense } from '../expense/expense.model';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  expenseGroups: Group[]=[];
  expenses: Expense[]=[];
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  loggedUserID: number;
  isEnteredBudget = false;
  constructor(private manageService: ManageService, private userService: UserService, private route: ActivatedRoute) { }

  getBudget(){
    this.budget = this.manageService.getBudget();
  }
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


}
