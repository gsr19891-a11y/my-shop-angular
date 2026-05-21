import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,RouterLink, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {

  forgotPassForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService
  ){}


  ngOnInit(): void {
    this.forgotPassForm = this.fb.group({
      email: ['']
    })
  }


  forgotPassword(){
    const emailValue = this.forgotPassForm.value.email;


    this.authService.forgotPass(emailValue).subscribe({
      next: (res)=>{
        console.log(res);
      },
      error(err) {
        console.error(err);
      },
    })

    
  }

}
