import {Component, OnInit}                  from '@angular/core';
import {User}                               from './user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService}                        from './user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  users: User[];
  signupForm: FormGroup;
  isSignedUp;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.users = [];
    this.isSignedUp = false;
  }

  formErrors = {
    login: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    birth_date: '',
    residence: '',
    country: '',
  };
  private validationMessages = {
    login: {
      required: 'Login is required'
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must have at least 8 characters'
    },
    name: {
      required: 'Name is required'
    },
    surname: {
      required: 'Surname is required'
    },
    email: {
      required: 'Email is required'
    },
    birth_date: {
      required: 'Birth date is required'
    },
    residence: {
      required: 'Residence is required'
    },
    country: {
      required: 'Country is required'
    }
  };

  ngOnInit() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users);

    });
    this.signupForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.email],
      birth_date: ['', Validators.required],
      residence: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.signupForm.valueChanges.subscribe(() => {
      this.onControlValueChanged();
    });
    this.onControlValueChanged();
  }

  onControlValueChanged() {
    const signUpForm = this.signupForm;
    for (const i in this.formErrors) {
      this.formErrors[i] = '';
      const control = signUpForm.get(i);
      if (control && control.dirty && !control.valid) {
        const validationMessages = this.validationMessages[i];
        for (const key in control.errors) {
          this.formErrors[i] += validationMessages[key] + '';
        }
      }
    }
  }

  onSignUp(form) {
    const autoIncrement = this.users.length + 1;
    const newUser: User = {
      ...form.value,
      userID: autoIncrement
    };
    this.userService.setUser(newUser).subscribe(res => {
      this.users.push(newUser);
      this.isSignedUp = true;
      alert('Successfully signed up as ' + res.login);
    });
  }
}
