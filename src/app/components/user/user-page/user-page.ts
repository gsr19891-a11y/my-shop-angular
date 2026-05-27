import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { UserInterface } from '../../../interface/authInterface/user-interface';
import { LangService } from '../../../services/lang-service';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-user-page',
  imports: [RouterOutlet, RouterLinkWithHref, TranslatePipe,RouterLinkActive],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss',
})
export class UserPage {

  langService = inject(LangService)
  constructor(private authService: AuthService,
    private change: ChangeDetectorRef,
    private router: Router
  ){}


  token!: string | null
  user!:UserInterface | null
  ngOnInit() {
    this.token = this.authService.getToken()
    this.change.detectChanges();


    if(!this.token){
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
        
      })
    
    }else{
      this.authService.getUser().subscribe({
        next: (res) =>{
          this.user = res;
          this.change.detectChanges();
        },
        error: (err) => {
          console.error(err);
          
        }
      })
    }
  }


  tokenDelete() {

  localStorage.removeItem('userToken');
  

  this.user = null;


  setTimeout(() => {
      this.router.navigate(['/']).then(() => {

    window.location.reload(); 
  });
  })

}






}
