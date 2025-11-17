import { Component } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...ReactiveModeuls],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: any;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      localStorage.setItem('UserAuth', '1'); 
      this.router.navigate(['/admin']);

    }
  }

  onCheckUser() {
    console.log('Decoded User:', this.loginService.getUser());
    console.log('Is Logged In:', this.loginService.isLoggedIn());
  }
}
