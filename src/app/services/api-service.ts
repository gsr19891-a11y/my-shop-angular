import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public XAPIKEY = signal( '0e38aad2-150e-4d68-8c9b-0cb9ba0effd7')
  public baseUrl = 'https://shopapi.stepacademy.ge/api/products';
  public categoriesUrl = 'https://shopapi.stepacademy.ge/api/categories';

  public registerUrl = 'https://shopapi.stepacademy.ge/api/auth/register'
  public loginUrl= 'https://shopapi.stepacademy.ge/api/auth/login'


  public cartUrl = 'https://shopapi.stepacademy.ge/api/cart'
  public favoritesUrl = 'https://shopapi.stepacademy.ge/api/favorites'

}
