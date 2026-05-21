import { ChangeDetectorRef, Component, inject, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterLinkWithHref, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductIdInterfaceFull } from '../../interfaceById/product-id-interface-full';
import { ProductService } from '../../services/product-service';
import { ReviewsInterface } from '../../interface/reviews-interface';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LangService } from '../../services/lang-service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-product-info',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref,FormsModule, RouterLink, TranslatePipe],
  templateUrl: './product-info.html',
  styleUrl: './product-info.scss',
})
export class ProductInfo {

 public reviewsData!: ReviewsInterface | null;
 public currentQuantity = 1;
 public selectedImage?: string | null = null;
  favoriteIds: number[] = [];

  langService = inject(LangService)



  constructor(
    private routes: ActivatedRoute,
    private productService: ProductService,
    private change: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}
  id!: number;
  public productId!: ProductIdInterfaceFull | null;

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      this.id = +params['id'];
    });
    this.productService.getProductById(this.id).subscribe((data) => {
      this.productId = data;
      this.change.detectChanges();
    });

    this.productService.reviews(this.id).subscribe((data) => {
      this.reviewsData = data;
      this.change.detectChanges();
    });

    this.selectedImage = this.productId?.data.imageUrl;

    this.loadFavorites()
  }//oninit

  
  productReviews(id: number) {
    return this.productService.reviews(id);
  }

  quantityInc(){
    if(this.productId?.data.stock){
     
      this.currentQuantity += 1
    }
  }
  quantityDec(){
    if(this.currentQuantity < 1){
      this.currentQuantity = 1
    }
    this.currentQuantity -= 1
  }


  addToCart(id: number) {
    const body = {
      productId: id,
      quantity: this.currentQuantity
    }

    if(this.productId?.data?.stock){
    this.productService.addToCart(body).subscribe({
      next: (res) => {
        this.productService.allCart().subscribe();
        console.log('product added',res);
        alert('Product added to cart!');
      },error:(err) =>{
        if(err.status === 401){
          alert('You are not logged in!');
          this.router.navigate(['/auth/login']);
          this.change.detectChanges();
        }
      },
    })}


    return this.productService.addToCart(id);
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
  this.productService.addToFavorites(id).subscribe({
    next: (res) => {
      this.productService.favoriteCount.set(this.productService.favoriteCount() + 1);
   
      if (!this.favoriteIds.includes(id)) {
        this.favoriteIds.push(id); 
      }
      
    
      this.change.detectChanges();
      
      console.log('Product added to UI state');
    },
    error: (err) => {
      if (err.status === 400) {
        this.removeFromFavorites(id);
      }
    }
  });
}


selectImage(image: string) {
  this.selectedImage = image;
  this.change.detectChanges();
}


  loadFavorites() {
    if (!this.authService.getToken()) {
      return;
    }
    this.productService.getFavorites().subscribe({
      next: (res: any) => {
        this.favoriteIds = res.data.items.map((item: any) => item.id);
        this.change.detectChanges();
      }
    });
  }

  removeFromFavorites(id: number) {
    this.productService.deleteFromFavorites(id).subscribe({
      next: () => {
        this.productService.favoriteCount.set(this.productService.favoriteCount() - 1);
        this.favoriteIds = this.favoriteIds.filter(favId => favId !== id);
        this.change.detectChanges();
      }
    });
  }


  isProductFavorite(id: number): boolean {
    return this.favoriteIds?.includes(id) || false;

}

toggleFavorite(id: number) {
  if (this.isProductFavorite(id)) {
    this.removeFromFavorites(id);
  } else {
    this.addFavorites(id);
  }

  if(!this.authService.getToken()){
    return alert('You are not logged in!');
   
  }
}







}
