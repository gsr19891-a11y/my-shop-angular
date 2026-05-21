import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { Router } from '@angular/router';
import { LangService } from '../../../../services/lang-service';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule, FormsModule,TranslatePipe],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {

changePassForm!:FormGroup;

 langService = inject(LangService)
  constructor( 
    private authService: AuthService,
    private change: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ){}


  ngOnInit(): void {

    this.changePassForm = this.fb.group({
      currentPassword: [''],
      newPassword: [''],
      ConfirmPassword: ['']
    })
  }


  changePass(){
    if(this.changePassForm.value.newPassword !== this.changePassForm.value.ConfirmPassword){
      alert('Passwords do not match');
      return
    }
    this.authService.changePassword(this.changePassForm.value).subscribe({
      next: (res)=>{
        console.log(res);
      },
      error(err) {
        console.error(err);
      },
    })
  }

deleteAccount() {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (!confirmDelete) return;

  this.authService.deleteProfile().subscribe({
    next: (res) => {
      
      localStorage.removeItem('userToken');
      
      console.log('Token removed and account deleted:', res);

   
      this.router.navigate(['/auth/register']).then(() => {
       
        window.location.reload();
      });
    },
    error: (err) => {
      console.error('Delete failed:', err);
    }
  });
}



}
