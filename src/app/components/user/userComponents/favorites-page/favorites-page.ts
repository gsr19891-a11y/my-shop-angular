import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { ProductService } from '../../../../services/product-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { LangService } from '../../../../services/lang-service';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-favorites-page',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  allFavorites!: any | null;
  cartMessage: string | null = null;


langService = inject(LangService)
  constructor(
    private authService: AuthService,
    public productService: ProductService,
    private change: ChangeDetectorRef,
    private router: Router
  ){}





ngOnInit(): void {

  if (!this.authService.getToken()) {
    this.router.navigate(['/login']);
    return;
  }

  this.productService.getFavorites().subscribe({
    next: (res) => {
      this.productService.allFavoritesCart.set(res?.data?.items || []);
      this.change.detectChanges();
    },
    error: (err) => console.error('Ошибка при загрузке избранного:', err)
  });

  this.getFavorites();
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


deleteFavorites(id: number) {
    this.productService.deleteFromFavorites(id).subscribe({
      next: () => {
        this.productService.allFavoritesCart.update(items => 
          items.filter(item => item.id !== id)
        );
        
    
        this.productService.favoriteCount.update(count => count > 0 ? count - 1 : 0);
        
        this.change.detectChanges();
      }
    });
  }


showProductDetails(id:number){
  this.router.navigate(['/product-info', id]);

}

getFavorites(){
  this.productService.getFavorites().subscribe({
    next: (res:any) => {
      this.productService.favoriteCount.set(res?.data?.totalCount);
      this.change.detectChanges();
    },error: (err) => console.error( err)
  })
}

loadFavorites() {
    this.productService.getFavorites().subscribe({
      next: (res: any) => {

        this.productService.allFavoritesCart.set(res?.data?.items || []);
    
        this.change.detectChanges();
      }
    });
  }





}
