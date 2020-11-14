import {Component, OnInit}                  from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService}                        from '../signup/user.service';
import {Router}                             from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  isSignedIn: boolean;
  isSignedOut: boolean;
  formErrors: any = {
    login: '',
    password: ''
  };
  _validationMessages = {
    login: {
      required: 'Login is required'
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must have at least 8 characters'
    }
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.isSignedIn = false;
    this.isSignedOut = true;
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.signInForm.valueChanges.subscribe(() => {
      this.onControlValueChanged();
    });
    this.onControlValueChanged();
  }

  onControlValueChanged() {
    const form = this.signInForm;
    for (const i in this.formErrors) {
      this.formErrors[i] = '';
      const control = form.get(i);
      if (control && control.dirty && !control.valid) {
        const validationMessages = this._validationMessages[i];
        for (const key in control.errors) {
          this.formErrors[i] += validationMessages[key] + '';
        }
      }
    }
  }

  onSignIn(form) {
    this.userService.signInUser(form.value).subscribe(res => {
      const loggedUserID = res.userID;
      this.router.navigate(['/summary', loggedUserID]);
    });
  }
}
