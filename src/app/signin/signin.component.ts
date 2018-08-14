import { Component, OnInit } from '@angular/core';
import {NgForm, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {User} from '../signup/user.model';
import { SignupComponent } from '../signup/signup.component';
import { UserService } from '../signup/user.service';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  users: User[] = [];
  signInForm: FormGroup;
  public isSignedIn: boolean = false;
  public isSignedOut: boolean = true;
  loggedUserID: number;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private router: Router) { }
    formErrors={
      login: '',
      password: ''
    }
  private validationMessages = {
    login:{
      required: 'Login is required'
    },
    password:{
      required: 'Password is required',
      minLength: 'Password must have at least 8 characters'
    }
  }
  ngOnInit() {
    this.userService.getUsers().subscribe((users)=>{
      this.users = users;
      console.log(this.users);
    });
    this.signInForm = this.formBuilder.group({
      login: ['',Validators.required],
      password:['',[Validators.required,Validators.minLength(8)]]
    });
    this.signInForm.valueChanges.subscribe((value)=>{
      this.onControlValueChanged();
    });
    this.onControlValueChanged();
  }

  onControlValueChanged(){
    const form = this.signInForm;
    for(let i in this.formErrors){
      this.formErrors[i] = '';
      let control = form.get(i);
      if(control && control.dirty && !control.valid){
        const validationMessages = this.validationMessages[i];
        for(const key in control.errors){
          this.formErrors[i] += validationMessages[key]+''
        }
      }
    }
  }
   onSignIn(form){
        const value = form.value;
        this.users.filter(s=>{
          if(value.login === s.login && value.password === s.password){
            this.loggedUserID = s.userID;
            this.userService.getUserById(this.loggedUserID).subscribe(res=>{
              console.log(res);
            });
            this.isSignedIn=true;
            this.router.navigate(['/summary',this.loggedUserID]);
            alert('Welcome, '+ value.login);
          }
        });
      
    }
    onSignOut(){
      this.isSignedOut = (this.isSignedIn) ? true : false;
      console.log(this.isSignedOut);
    }
    

}
