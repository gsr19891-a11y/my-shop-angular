import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CategoriesService } from '../../services/categories-service';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../interface/product-response';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriesInterface } from '../../interface/category-interface';
import { ProductService } from '../../services/product-service';
import { AppProductCard } from "../app-product-card/app-product-card";
import { BehaviorSubject } from 'rxjs';
import { TranslatePipe} from '../../pipes/translate-pipe';
import { LangService } from '../../services/lang-service';



@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, AppProductCard, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  langService = inject(LangService)

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('userToken'));
isLoggedIn$ = this.loggedIn.asObservable();
  
  categories!: Signal<CategoriesInterface | null>;
  products!: Signal<ProductResponse | null>;


  constructor(public categoriesService: CategoriesService, public productService: ProductService, private router: Router) {
    this.categories = toSignal(categoriesService.getCategories(),{
      initialValue: null
    });

    this.products = toSignal(productService.getProducts(),{
      initialValue: null
    })


  }




goToDetails(item: any) {
  this.router.navigate(['/product-info', item.id], {
    queryParams: {
      name: item.name,
      brand: item.brand,
      model: item.model,
      price: item.price,
      imageUrl: item.imageUrl,
      categoryImageUrl: item.category.imageUrl, 
      description: item.category.description,   
      rating: item.rating,
      stock: item.stock,
      categoryName: item.category.name
    }
  });
}

currentModel: string = 'assets/headphone.glb';

changeModel(modelPath: string){
  this.currentModel = modelPath
}


updateAuthStatus() {
  this.loggedIn.next(!!localStorage.getItem('userToken'));
}

logout() {
  localStorage.removeItem('userToken');
  this.updateAuthStatus();
}

}
