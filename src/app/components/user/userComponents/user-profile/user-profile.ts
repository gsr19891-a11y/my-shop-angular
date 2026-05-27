import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserInterface } from '../../../../interface/authInterface/user-interface';
import { AuthService } from '../../../../services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LangService } from '../../../../services/lang-service';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
user!: UserInterface | null;
sub!: Subscription
imageForm!: FormGroup;


 langService = inject(LangService)
constructor(
  private authService: AuthService,
  private fb: FormBuilder,
  private change: ChangeDetectorRef
){}


ngOnInit(){

  this.sub = this.authService.getUser().subscribe({
    next: (res) => {
      this.user = res;
      console.log(this.user);
    },
    error: (err) => {
      console.error(err);
    }
  })


this.imageForm = this.fb.group({
    email: [''],
    pictureUrl: [''],
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    address: [''],
    dateOfBirth: ['']
  });

  this.sub = this.authService.getUser().subscribe({
    next: (res) => {
      this.user = res;
      if (this.user?.data) {
        this.imageForm.patchValue({
          firstName: this.user.data.firstName,
          lastName: this.user.data.lastName,
          pictureUrl: this.user.data.details?.pictureUrl,
          phoneNumber: this.user.data.details?.phoneNumber,
          address: this.user.data.details?.address,
         dateOfBirth: this.user.data.details?.dateOfBirth 
    ? this.user.data.details.dateOfBirth.split('T')[0] 
    : (this.user.data.dateOfBirth ? this.user.data.dateOfBirth.split('T')[0] : '')
        });
      }
    }
  });


}




uploadImage() {
  if (this.imageForm.invalid || !this.user?.data) return;

  const rawValues = this.imageForm.value;


  let isoDate = null;
  if (rawValues.dateOfBirth) {
    const d = new Date(rawValues.dateOfBirth);
    if (!isNaN(d.getTime())) {
      isoDate = d.toISOString();
    }
  }

  
  const updateForm = {
    firstName: rawValues.firstName,
    lastName: rawValues.lastName,
    email: rawValues.email,
    phoneNumber: rawValues.phoneNumber,
    address: rawValues.address,
    pictureUrl: rawValues.pictureUrl,
    dateOfBirth: isoDate
  };

  console.log('Update form', updateForm);

  this.authService.updateProfile(updateForm).subscribe({
    next: (res: any) => {
      console.log('Profile updated!', res);
      alert('Profile updated successfully!');
      if (this.user?.data?.details) {
        this.user.data.details.pictureUrl = rawValues.pictureUrl;
      }
      this.change.detectChanges();
    },
    error: (err) => {
      console.error('Update failed', err);
    }
  });
}









}
