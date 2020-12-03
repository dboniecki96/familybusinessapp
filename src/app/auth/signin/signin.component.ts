import {Component, OnInit}                  from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService}                        from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      login: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  onSignIn(form: FormGroup) {
    this.authService.authenticateUser(form.value);
  }
}
