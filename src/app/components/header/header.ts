import { ChangeDetectorRef, Component, Directive, inject, signal, Signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriesService } from '../../services/categories-service';
import { CommonModule } from '@angular/common';
import { Derectives } from '../../models/derectives';
import { CategoriesInterface } from '../../interface/category-interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth-service';
import { UserInterface } from '../../interface/authInterface/user-interface';
import { Subscription, shareReplay, switchMap } from 'rxjs';
import { CartInterface } from '../../interface/cartInterface/cart-interface';
import { CarResponse } from '../../interface/cartInterface/cart-response';
import { LangService } from '../../services/lang-service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    Derectives,
    TranslatePipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  langService = inject(LangService);

  categories!: Signal<CategoriesInterface | null>;
  cartItems!: CarResponse | null;
  favorites!: any | null;
  token!: string | null;

  isMenuOpen = false;
  user!: UserInterface | null;
  
  private sub = new Subscription();
  private dataLoadedFlag = false; 

  constructor(
    public categoriesService: CategoriesService,
    public productService: ProductService,
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private change: ChangeDetectorRef,
  ) {
    this.categories = toSignal(categoriesService.getCategories(), {
      initialValue: null,
    });
  }

  ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token && !this.dataLoadedFlag) {
      this.dataLoadedFlag = true; 
      this.loadInitialData();
    }

    this.change.detectChanges();
  }


  private loadInitialData() {
    // Load cart count
    this.sub.add(
      this.productService.allCart().subscribe({
        next: (res: any) => {
          this.productService.cartCount.set(res?.data?.totalCount || 0);
          this.change.detectChanges();
        },
        error: (err) => console.error('Cart error:', err),
      })
    );

    // Load user data
    this.sub.add(
      this.authService.getUser().subscribe({
        next: (response) => {
          this.user = response;
          this.change.detectChanges();
        },
        error: (err) => {
          console.error('User fetch error:', err);
        },
      })
    );

    // Load favorites
    this.sub.add(
      this.productService.getFavorites().subscribe({
        next: (res: any) => {
          this.productService.favoriteCount.set(res?.data?.totalCount || 0);
          this.change.detectChanges();
        },
        error: (err) => {
          if (err.status === 429) {
            console.warn('Rate limited on favorites load');
          } else {
            console.error('Favorites fetch error:', err);
          }
        },
      })
    );
  }

  get cartCount(): number {
    return this.productService.cartCount();
  }

  get favCount(): number {
    return this.productService.favoriteCount();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  changeLang(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as 'en' | 'ka';
    this.langService.setLanguage(lang);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}