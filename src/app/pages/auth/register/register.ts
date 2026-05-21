import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

  registerForm!: FormGroup


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  
register() {
  if (this.registerForm.valid) {
    const email = this.registerForm.value.email;

    this.authService.registerPost(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('coreect registrer', response);
this.router.navigate(['/auth/verify', email]);
      },
      error: (err) => {

        console.error('error', err);
        alert('error!');
      }
    });
  }
}


}
