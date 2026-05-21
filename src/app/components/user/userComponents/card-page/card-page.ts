import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { CartInterface } from '../../../../interface/cartInterface/cart-interface';
import { ProductService } from '../../../../services/product-service';
import { CarResponse } from '../../../../interface/cartInterface/cart-response';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { from, concatMap } from 'rxjs';
import { LangService } from '../../../../services/lang-service';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-card-page',
  imports: [CommonModule, RouterLink,TranslatePipe],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
})
export class CardPage {
   langService = inject(LangService)

  token!: string | null;
  cartItems!: CarResponse | null;
  currentQuantity = 1;


  constructor(
    private authService: AuthService,
    private change: ChangeDetectorRef,
    private productService: ProductService,
    private router: Router

  ) {}


 ngOnInit() {
    this.token = this.authService.getToken();
    
    if (this.token) {
      this.productService.allCart().subscribe({
        next: (res: any) => {
          this.cartItems = res;
          this.change.detectChanges();
        },
        error: (err) => console.error( err)
      });
    }
  }



    removeCart(id: number) {
      return this.productService.removeFromCart(id).subscribe({
        next: (res) => {
          console.log('product removed',res);
          this.productService.allCart().subscribe({
            next: (res: any) => {
              this.cartItems = res;
              console.log( this.cartItems);
              this.change.detectChanges();
            },
            error: (err) => console.error( err)
          })


          this.change.detectChanges();
        },error(err) {
          console.error(err);
        },
      })
      
    }


clearCart() {
  if (!this.cartItems?.data?.items.length) return;

  const itemsToDelete = [...this.cartItems.data.items];


  this.cartItems.data.items = [];
  this.cartItems.data.totalCount = 0;
  this.change.detectChanges();

  itemsToDelete.forEach(item => {
    const idToSend = item.id; 
    
    this.productService.removeAllCart(idToSend).subscribe({
      next: () => console.log(`all cart deleted: ${idToSend}`),
      error: (err) => console.error(`error while deleting ${idToSend}:`, err)
    });
  });
}

get grandTotal(): number {
  return this.cartItems?.data?.items.reduce((acc, item) => acc + item.totalPrice, 0) || 0;
}




changeQuantity(item: any, delta: number) {
  const newQty = item.quantity + delta;
  if (newQty < 1) return;


  const payload = {
    itemId: item.id, 
    quantity: newQty
  };

  this.productService.editQuantity(payload).subscribe({
    next: (res) => {
      console.log('quantity changed:', res);
      item.quantity = newQty;
      
  
      item.totalPrice = item.product.price * newQty;
      
      this.change.detectChanges();
    },
    error: (err) => {
      console.error('error:', err);
    }
  });
}


onCheckout() {
  this.productService.checkout().subscribe({
   next: (res) => {
  console.log('checkout success:', res);
  this.productService.cartCount.set(0);

  if (this.cartItems && this.cartItems.data) {
    this.cartItems.data.items = [];
    this.cartItems.data.totalCount = 0;
  }

  this.change.detectChanges();
},
    error: (err) => {
      console.error('checkout error:', err);
    }
  })

  



}
}