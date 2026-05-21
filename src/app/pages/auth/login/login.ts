import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInIntrface } from '../../../interface/sign-in-intrface';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  signInForm!: FormGroup;
  sub!:Subscription;

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['',Validators.required],
      remember: [false],
    });
  }


  onSignIn(): void {
    if (this.signInForm.invalid) {
      return;
    } else {
      this.authService.loginPost(this.signInForm.value).subscribe({
        next: (response) => {
        console.log('login correct', response);
        localStorage.setItem('userToken', JSON.stringify(response));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('error server!', err);
        alert('error server!');
      }
      })
      const { email, password, remember } = this.signInForm.value;
      console.log(email, password);


      if (remember) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
    }
  }

}
