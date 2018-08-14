import { Component, OnInit } from '@angular/core';
import { SigninComponent } from '../signin/signin.component';
import { User } from './user.model';
import { AlertPromise } from 'selenium-webdriver';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
// import { users } from './mock-user.model';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  users: User[] = [];
  signupForm: FormGroup;
  public isSignedUp = false;
  constructor(private formBuilder : FormBuilder,private userService: UserService) {

   }
  formErrors={
    login: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    birth_date: '',
    residence: '',
    country: '',
  }
  private validationMessages = {
    login:{
      required: 'Login is required'
    },
    password:{
      required: 'Password is required',
      minLength: 'Password must have at least 8 characters'
    },
    name:{
      required: 'Name is required'
    },
    surname:{
      required: 'Surname is required'
    },
    email:{
      required: 'Email is required'
    },
    birth_date:{
      required: 'Birth date is required'
    },
    residence:{
      required: 'Residence is required'
    },
    country:{
      required: 'Country is required'
    }
  }
  
  ngOnInit() {
    this.userService.getUsers().subscribe((users: User[])=>{
      this.users = users;
      console.log(this.users);

    });
    this.signupForm = this.formBuilder.group({
      login:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(8)]],
      name:['',Validators.required],
      surname:['',Validators.required],
      email:['',Validators.email],
      birth_date:['',Validators.required],
      residence:['',Validators.required],
      country:['',Validators.required],
    });
    this.signupForm.valueChanges.subscribe((value)=>{
      this.onControlValueChanged();
    });
    this.onControlValueChanged();
  }
  onControlValueChanged(){
    const signUpForm = this.signupForm;
    for(let i in this.formErrors){
      this.formErrors[i] = '';
      let control = signUpForm.get(i);
      if(control && control.dirty && !control.valid){
        const validationMessages = this.validationMessages[i];
        for(const key in control.errors){
          this.formErrors[i] += validationMessages[key]+''
        }
      }
    }
  }
  
  onSignUp(form){
    const value = form.value;
    console.log(value);
    let autoIncrement = this.users.length+1;
    const newUser = new User(autoIncrement,value.name,value.surname,value.birth_date,value.residence,value.country,value.login,value.password,value.email);
    this.userService.setUser(newUser).subscribe(res => {
      console.log('res ' + res);
      this.users.push(newUser);
    }, err => {console.log(err)});
    console.log(this.users);
    this.isSignedUp=true;
    alert('Successfully signed up as ' + value.login);
  }
}
