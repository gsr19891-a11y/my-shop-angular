import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { AuthService } from '../../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

    private toastr = inject(ToastrService);
  registerForm!: FormGroup

   showSuccess(text: string) {
    this.toastr.success(text);
  }

  showError(text: string) {
    this.toastr.error(text);
  }

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
        console.log('succsess registrer', response);
        this.showSuccess('Welcome!');
this.router.navigate(['/auth/verify', email]);

      },
      error: (err) => {

        this.showError('Error register!');
        console.error('error', err);
      }
    });
  }
}


}
