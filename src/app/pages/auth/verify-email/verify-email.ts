import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail {
  email: string = '';
  verificationCode: string = '';

  verifyEmailForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private routes: ActivatedRoute, private router: Router){}

  ngOnInit(): void {

    this.email = this.routes.snapshot.paramMap.get('email') || 'null';

    this.verifyEmailForm = this.fb.group({
      email: [this.email],
      code: ['']
    });
  }




  verifyEmail(){

    this.authService.verifyEmail(this.verifyEmailForm.value).subscribe({
      next: (res)=>{
        console.log(res);
        localStorage.setItem('userToken', JSON.stringify(res));
        this.router.navigate(['/']);
      },
      error(err) {
        console.error(err);
      },
    })

  }

resendCode() {
    if (this.email) {
      this.authService.resendCode(this.email).subscribe({
        next: (res) => console.log('send code:', this.email),
        error: (err) => console.error(err)
      });
    }
  }

}
