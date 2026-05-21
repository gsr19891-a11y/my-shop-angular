import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { RegisterInterface } from '../interface/register-interface';
import { SignInIntrface } from '../interface/sign-in-intrface';
import { DataInterface } from '../interface/authInterface/data-interface';
import { LoginResponseInterfase } from '../interface/authInterface/login-response-interfase';
import { UserInterface } from '../interface/authInterface/user-interface';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('userToken'));
  public isLoggedIn$ = this.loggedIn.asObservable();
  public userToken = signal<LoginResponseInterfase | null>(null);

   constructor(private http: HttpClient,
     private apiService: ApiService,
     private router: Router) {
    this.initializeAuth();
  }


  updateAuthStatus() {
    this.loggedIn.next(!!localStorage.getItem('userToken'));
    this.userToken.set(null);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.updateAuthStatus(); 
    this.router.navigate(['/']);
  }


 

  


  private initializeAuth() {
    const data = localStorage.getItem('userToken');
    if (data) {
      try {
        this.userToken.set(JSON.parse(data));
      } catch (e) {
        localStorage.removeItem('userToken');
      }
    }
  }

  setSession(authData: LoginResponseInterfase) {
    localStorage.setItem('userToken', JSON.stringify(authData));
    this.userToken.set(authData);
  }


  registerPost(form: RegisterInterface){
    return this.http.post(this.apiService.registerUrl, form,{
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY()
      }
    });
  }

  loginPost(form:any){
    return this.http.post<SignInIntrface>(this.apiService.loginUrl, form,{
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY()
      }
    });
  }

forgotPass(email: string) {
  return this.http.post(
    `https://shopapi.stepacademy.ge/api/auth/forget-password/${email}`, 
    {}, 
    {   
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY()
      }
    }
  );
}



verifyEmail(form: any) {

  return this.http.put('https://shopapi.stepacademy.ge/api/auth/verify-email', form, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': this.apiService.XAPIKEY()
    }
  });
}

resendCode(email: string) {

  return this.http.post(
    `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${email}`,
    {}, 
    {  
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY()
      }
    }
  );
}

getToken() {
  const data = localStorage.getItem('userToken');
  if (!data) return null;
  
  try {
    const parsed = JSON.parse(data);
    return parsed.data?.accessToken || null;
  } catch (e) {
    return null;
  }
}



getUser(){
  const token = this.getToken()

  if (!token) {
    console.error('no token!');
  }




  return this.http.get<UserInterface>('https://shopapi.stepacademy.ge/api/users/me',{
    headers: {
      'Accept': 'application/json',
      'x-api-key': this.apiService.XAPIKEY(),
      'Authorization': `Bearer ${token}`
    }
  })
}




updateProfile(payload: any) {
  return this.http.put('https://shopapi.stepacademy.ge/api/users', payload,{
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': this.apiService.XAPIKEY(),
      'Authorization': `Bearer ${this.getToken()}`
    }
  });
}




changePassword(payload: any) {
  return this.http.put('https://shopapi.stepacademy.ge/api/users/change-password', payload, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': this.apiService.XAPIKEY(),
      'Authorization': `Bearer ${this.getToken()}`
    }
  })
}


deleteProfile(){
  return this.http.delete('https://shopapi.stepacademy.ge/api/users/delete-profile',{
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': this.apiService.XAPIKEY(),
      'Authorization': `Bearer ${this.getToken()}`
    }
  })
}







}
