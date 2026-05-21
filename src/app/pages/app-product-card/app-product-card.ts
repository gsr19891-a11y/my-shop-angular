import { ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ProductItemInterface } from '../../interfaceById/product-item-interface';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories-service';
import { CategoriesInterface } from '../../interface/category-interface';
import { Category } from '../../interface/category';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { LangService } from '../../services/lang-service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-app-product-card',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './app-product-card.html',
  styleUrl: './app-product-card.scss',
})
export class AppProductCard {
  allCategory!: Category | null;
    langService = inject(LangService)

  favoriteIds: number[] = [];

  constructor( 
    private router: Router, 
    private categoryService:CategoriesService,
    private authService:AuthService,
    private change : ChangeDetectorRef,
  private productService:ProductService){}

  @Input({ required: true }) product!: any;

  showProductDetails(id:number){
this.router.navigate(['/product-info', id]);
  }

ngOnInit() {
  const token = this.authService.getToken();
  if (token) {
    this.productService.getFavorites().subscribe();
  }
}


  addToCart(id: number) {
    const body = {
      productId: id,
      quantity: 1
    }
    
    return this.productService.addToCart(body).subscribe({
      next: (res) => {
        console.log('product added',res);
        this.productService.allCart().subscribe();
        this.change.detectChanges();
      },error(err) {
        console.error(err);
      },
    });
  }

// loadFavorites() {
//   const token = this.authService.getToken();
//   if (!token) return;

//   this.productService.getFavorites().subscribe({
//     next: (res: any) => {
//       this.favoriteIds = res?.data?.items?.map((item: any) => item.id) || [];
//       this.change.detectChanges();
//     },
//     error: (err) => {
//       if (err.status === 429) {
//         console.error('Too many requests! Wait a moment.');
//       }
//     }
//   });
// }

removeFromFavorites(id: number) {
  this.productService.deleteFromFavorites(id).subscribe({
    next: () => {
   
      this.favoriteIds = this.favoriteIds.filter(favId => favId !== id);
      
      this.change.detectChanges();
    }
  });
}


  isProductFavorite(id: number): boolean {
    return this.favoriteIds?.includes(id) || false;



}


getStars(rating: number): string[] {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('fa-solid fa-star gold');
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push('fa-solid fa-star-half-stroke gold'); 
    } else {
      stars.push('fa-regular fa-star gray'); 
    }
  }
  return stars;
}

addFavorites(id: number) {
  
  const token = this.authService.getToken();
  if (!token) return;


  if (this.favoriteIds.includes(id)) {
    console.warn('Product already in favorites');
    return;
  }

  this.productService.addToFavorites(id).subscribe({
    next: () => {

      this.favoriteIds.push(id);

      this.productService.favoriteCount.update(count => count + 1);
      
      this.change.detectChanges();
    },
    error: (err) => {
      console.error('Error adding to favorites', err);

    }
  });
}


toggleFavorite(id: number) {
  if (this.isProductFavorite(id)) {
    this.removeFromFavorites(id);
  } else {
    this.addFavorites(id);
  }
}









}
