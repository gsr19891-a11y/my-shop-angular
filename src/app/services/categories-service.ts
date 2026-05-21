import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { CategoriesInterface } from '../interface/category-interface';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {

 constructor(private http: HttpClient, private apiService: ApiService) {}

  getCategories() {
    return this.http.get<CategoriesInterface>(this.apiService.categoriesUrl, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
      }
    })


}
}