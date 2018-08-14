import { Component, OnInit, Output } from '@angular/core';
import { NgForm} from '@angular/forms';
import {Expense} from './expense/expense.model';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';
import { forEach } from '@angular/router/src/utils/collection';
import { EventEmitter } from '@angular/core';
import { Group } from './group.model';
import {ManageService} from './manage.service';
import { Router, ActivatedRoute } from '@angular/router';
import {map,filter} from 'rxjs/operators';
import { UserService } from '../signup/user.service';
import { User } from '../signup/user.model';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit { 
  router: Router;
  date: Date;
  user: User;
  isAnyExpenseGroup = false;
  isEnteredBudget = false;
  isOddMoney = false;
  loggedUserID: number;
  expenseGroups: Group[] = []; //Tablica grup wydatkow
  budgetKey = Object.keys(Group)[2];
  budget = Group[this.budgetKey]; //Budzet/Przychody miesieczne
  expenseGroupbalances : number[] = this.expenseGroups.map(a=>a.balance); //Tablica przelicznikow grup wydatkow
  sumOfExpenseGroupBalances = 0;//Suma grup wydatkow
  expenses: Expense[] =[]; //Tablica wydatkow
  expensebalances: number[] = this.expenses.map(a=>a.sum); //Tablica ilosci danych wydatkow
  expenseGroupIDs: number[] = this.expenses.map(a=>a.expensegroupID); //Tablica nazw grup wydatkow
  expenseGroupMoneyLeft: number[] = this.expenseGroups.map(a=>a.money_left); //Tablica pozostalosci w danej grupie wydatkow
  // expenseSum: number[] = this.expenses.map(a=>a.balance)//Tablica sum wydatkow
  isMoneyLeft=false;
  isMoneyLeftLow=false;
  isExpenseChoiceVisible=false;
  names: string[] = this.expenseGroups.map(a=>a.name);
  perc : number[] = this.expenseGroups.map(a=>a.percentage);
  
  expensesSum = this.expensebalances.reduce((a,b)=> a+b,0);
  addForm: FormGroup;
  

  constructor(private manageService: ManageService, private userService: UserService, private route: ActivatedRoute) { 
    for(let i=0;i<this.expenseGroupMoneyLeft.length;i++){
      this.expenseGroupMoneyLeft[i] = this.expenseGroupbalances[i]-this.expensesSum;
    }
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
    
    this.manageService.getExpenses().subscribe((expense: Expense[])=>{
      this.expenses = expense;
    });
    this.userService.getUserById(this.loggedUserID).subscribe((user: User)=>{
      this.route.paramMap.subscribe(params=>{
      this.loggedUserID = parseInt(params.get('id'));
        console.log(this.loggedUserID);
    });
    });
    this.addForm = new FormGroup({
      expenseGroup: new FormControl(null,Validators.required),
      balance: new FormControl(null,Validators.required)
    });
  }

  onUpdateBudget(budget: number){
    if(budget>0){
      this.budget=budget;
      for(let i=0;i<this.expenseGroupbalances.length;i++){
        this.expenseGroupbalances[i]=(this.budget*(+this.perc[i]))/100;
      }
      console.log('Budget changed to: ' + this.budget);
      this.isEnteredBudget=true;
    } 
  }

  onAddExpenseGroup(f: NgForm){
      const value = f.value;
      let balance :number = (value.percentage*this.budget)/100;
      let moneyleft = balance;
      let restOfPercentage = 100-value.percentage;
      let restOfBalance = this.budget -balance;
      let date = new Date().toISOString().slice(0,19).replace('T',' ');
      const newExpenseGroup = new Group(null,date,balance,moneyleft,value.name,value.percentage,this.budget,this.loggedUserID);
      console.log(newExpenseGroup);
        if((this.budget>0) && (value.percentage>=0) && (value.percentage<=100) && (value.name!='') && (this.budget>this.sumOfExpenseGroupBalances)){
          newExpenseGroup.money_left=balance;
          this.manageService.setExpenseGroups(newExpenseGroup,this.expenseGroups).subscribe(res=>{
            console.log(res);

          }, err=>{
            if (err) console.log(err)
          });
          this.sumOfExpenseGroupBalances+=balance;
          console.log(newExpenseGroup);
          console.log(this.expenseGroups);
          for(let i in this.expenseGroups){
            console.log(i);
          }
          this.expenseGroupbalances.splice(this.expenseGroups.length-1,0,balance); 
          this.expenseGroupMoneyLeft.splice(this.expenseGroups.length-1,0,newExpenseGroup.money_left);
          this.perc.push(value.percentage);
          this.names.push(value.name);
          console.log('Element added to the index of: ' + (this.expenseGroups.length-1));
          f.resetForm();
        if(this.expenseGroups.length>0){
          this.isExpenseChoiceVisible=true;
          this.isAnyExpenseGroup=true;
        }
        console.log('MoneyLeft for '+value.name + ' is ' + newExpenseGroup.money_left);
        if(!this.isOddMoney && (value.percentage<100 && value.percentage>0) && (restOfPercentage>0 && restOfBalance>0) && this.expenseGroups.length === 1){
          let expensesUndefined = new Group(null,null,restOfBalance,restOfBalance,'The rest of money',restOfPercentage,this.budget,this.loggedUserID);
          this.isOddMoney=true;
          this.expenseGroups.push(expensesUndefined);
          console.log(expensesUndefined);
          console.log('The rest of money exists: ' + this.isOddMoney);
        }
        else {
          this.expenseGroups.filter((obj)=>{
            if(obj.name === 'The rest of money' && obj.percentage>0){
                obj.percentage-=value.percentage;
                obj.balance-=balance;   
            }
            else if( obj.name === 'The rest of money' && value.percentage === obj.percentage){
              obj.percentage = value.percentage;
              obj.balance = balance;
              obj.name = value.name;
              this.expenseGroups.pop();
            }
          });
  
        }
      }
      console.log('Sum of balances: ' + this.sumOfExpenseGroupBalances);
      
      // this.expenseGroups.push(this.expenseGroups.splice(this.expenseGroups.indexOf(this.expensesUndefined),1)[0]);

    }
  filterGroupsOfUserID(userID: number){
    return this.expenseGroups.filter(x=>x.userID == this.loggedUserID);
  }
    
  onDeleteExpenseGroup(index: number){
    
      for(let i=0;i<this.expenseGroupMoneyLeft.length;i++){
        this.expenseGroupMoneyLeft[i]+=this.expenseGroupbalances[index];
      }
      this.sumOfExpenseGroupBalances-=this.expenseGroupbalances[index];
      this.expenseGroups.filter((obj)=>{
        if(obj.name === 'Odd Money' && obj.percentage < 100 && this.expenseGroups.length >2){
          this.expenseGroups.splice(index,1);
          // this.manageService.deleteExpenseGroups(index,this.expenseGroups).subscribe(res=>{
          //   console.log(res);
          // });
          this.expenseGroupbalances.splice(index,1);
          obj.balance+=this.expenseGroupbalances[index];
          obj.percentage+=this.perc[index];
        }
        if(obj.name !== 'Odd Money' && this.expenseGroups.length === 2){
          this.expenseGroupbalances.length=0;
          this.expenseGroups.length = 0;
          console.log(this.expenseGroups);
          this.isOddMoney = false;
        }
      });

      
      if(this.expenseGroups.length>0){
        this.isExpenseChoiceVisible=true;
      }
      else {
        this.isExpenseChoiceVisible=false;
      }
      console.log(this.isExpenseChoiceVisible);
      console.log('Sum of balances: ' + this.sumOfExpenseGroupBalances);
      console.log('Expense groups after delete'+ JSON.stringify(this.expenseGroups));
  }
  
  onSaveExpenseGroup(){
    this.isAnyExpenseGroup=true;
  }
  onClearForm(){
    this.budget=null;
    this.expenseGroups=[];
  }
 
}
