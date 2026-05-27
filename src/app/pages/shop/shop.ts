import { Component, signal, computed, inject, Signal, ChangeDetectorRef } from '@angular/core';
import { CategoriesService } from '../../services/categories-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriesInterface } from '../../interface/category-interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ProductResponse } from '../../interface/product-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter, map, Subscription } from 'rxjs';
import { AppProductCard } from '../app-product-card/app-product-card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { LangService } from '../../services/lang-service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-shop',
  imports: [ReactiveFormsModule, AppProductCard, TranslatePipe,DragDropModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.scss'],
})
export class Shop {
  filterSort!: FormGroup;
  sort!: any;

  langService = inject(LangService);

  favoriteIds: number[] = [];
  currentFilter: any = {
    Search: '',
    CategoryId: '',
    MinPrice: 0,
    MaxPrice: 9999,
    SortDescending: false,
    Page: 1,
    Take: 8,
  };

  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  categories!: Signal<CategoriesInterface | null>;
  products = signal<ProductResponse | null>(null);
  searchForm!: FormGroup;
  searchProducts?: ProductResponse;

  filterForm!: FormGroup;
  filterProducts?: ProductResponse;

  chatForm!: FormGroup;
  sub!: Subscription;
  n8nResponse = signal<any>(null);

  constructor(
    public categoriesService: CategoriesService,
    public productService: ProductService,
    public http: HttpClient,
    private routes: ActivatedRoute,
    private router: Router,
    private change: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.categories = toSignal(categoriesService.getCategories(), {
      initialValue: null,
    });
  }

  categoryForm = this.fb.group({
    categoryId: [null],
    minRating: [0],
    productSearch: [''],
    minPrice: [null],
    maxPrice: [null],
    inStock: [false],
  });

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: [''],
    });

    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),

        map((value: string) => value.replace(/-/g, '').trim()),
      )
      .subscribe((cleanValue) => {
        if (cleanValue) {
          this.productService.Search(cleanValue).subscribe((data) => {
            this.searchProducts = data as ProductResponse;
          });
        } else {
          this.searchProducts = null as any;
        }
      });

    this.filterForm = this.fb.group({
      minPrice: [0],
      maxPrice: [9999],
      search: [''],
      categoryId: [0],
      minRating: [0],
      inStock: [false],
      sortDescending: [false],
      page: [1],
      pageSize: [8],
    });

    this.filterForm.valueChanges.pipe(debounceTime(100), distinctUntilChanged()).subscribe(() => {
      this.onFilterSubmit();
      this.change.detectChanges();
    });

    this.filterForm.get('categoryId')?.valueChanges.subscribe(() => {
      this.onFilterSubmit();
    });

    this.routes.queryParams.subscribe((params) => {
      if (params['categoryId']) {
        const catId = +params['categoryId'];
        this.filterForm.patchValue({ categoryId: catId });
        this.onFilterSubmit();
      } else {
        this.onFilterSubmit();
      }
    });

    this.routes.queryParams.subscribe((params) => {
      const searchVal = params['search'] || '';
      const catId = params['categoryId'] ? +params['categoryId'] : null;

      this.filterForm.patchValue({
        search: searchVal,
        categoryId: catId,
      });

      this.onFilterSubmit();
    });

    this.routes.queryParams.subscribe((params) => {
      if (params['search']) {
        this.filterForm.patchValue({ search: params['search'] });
        this.onFilterSubmit();
      }
    });

    this.loadFavorites();

    this.filterSort = this.fb.group({
      sort: [''],
      sortDescending: [false],
    });

    this.routes.queryParams.subscribe((params) => {
      const sort = params['sort'];

      if (sort) {
        this.filterSort.patchValue({ sort });
        this.onSort();
      }
    });

    this.chatForm = this.fb.group({
      text: [''],
      email: [''],
    })



  }

  totalProducts = signal(0);

  setPage(pageNumber: number) {
    if (pageNumber < 1) return;
    this.filterForm.patchValue({ page: pageNumber });
    this.onFilterSubmit();
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }

    console.log(this.searchForm.value.search);

    this.productService.Search(this.searchForm.value.search).subscribe((data) => {
      this.searchProducts = data as ProductResponse;

      console.log(this.searchProducts);
    });
  }

  onFilterSubmit() {
    const filters = this.filterForm.value;
    const minR = filters.minRating || 0;

    let sortField = '';
    let isDescending = false;

    if (filters.sortBy === 'price-low') {
      sortField = 'price';
      isDescending = false;
    } else if (filters.sortBy === 'price-high') {
      sortField = 'price';
      isDescending = true;
    }

    const apiParams = {
      ...filters,
      Take: filters.pageSize,
      Page: filters.page,
      SortBy: sortField,
      SortDescending: isDescending,
    };

    this.productService.filterProducts(apiParams).subscribe((res: any) => {
      let rawItems: any[] = [];

      if (Array.isArray(res)) {
        rawItems = res;
      } else if (res?.data?.items) {
        rawItems = res.data.items;
      }

      const cleanItems = rawItems.filter((p) => p.rating >= minR);

      this.products.set({
        data: { items: cleanItems },
      } as ProductResponse);

      this.totalProducts.set(res?.data?.totalCount || 0);

      this.change.detectChanges();
    });
  }

  totalPages = computed(() => {
    const total = this.totalProducts();
    const pageSize = this.filterForm.get('pageSize')?.value || 8;
    return Math.ceil(total / pageSize);
  });

  pagesArray = computed(() => {
    const count = this.totalPages();
    return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [];
  });

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
        categoryName: item.category.name,
      },
    });
  }

  loadProducts() {
    this.productService.filterProducts(this.currentFilter).subscribe({
      next: (res: any) => {
        this.products.set(res);
      },
      error: (err) => console.error(err),
    });
  }

  loadFavorites() {
    if (!this.authService.getToken()) {
      return;
    }
    this.productService.getFavorites().subscribe({
      next: (res: any) => {
        this.favoriteIds = res.data.items.map((item: any) => item.id);
        this.change.detectChanges();
      },
    });
  }

  removeFromFavorites(id: number) {
    this.productService.deleteFromFavorites(id).subscribe({
      next: () => {
        this.favoriteIds = this.favoriteIds.filter((favId) => favId !== id);
        this.change.detectChanges();
      },
    });
  }

  isProductFavorite(id: number): boolean {
    return this.favoriteIds?.includes(id) || false;
  }

  addFavorites(id: number) {
    const token = this.authService.getToken();


    this.productService.addToFavorites(id).subscribe({
      next: (res) => {
        if (!this.favoriteIds.includes(id)) {
          this.favoriteIds.push(id);
        }

        this.change.detectChanges();

        alert('Product added to UI state');
      },
      error: (err) => {
          if (err.status === 400) {
          this.removeFromFavorites(id);

        }
      },
    });
    
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  onSort() {
    const value = this.filterSort.value.sort;

    let field = '';
    let isDesc = false;

    switch (value) {
      case 'price-asc':
        field = 'Price';
        isDesc = false;
        break;
      case 'price-desc':
        field = 'Price';
        isDesc = true;
        break;
      case 'rating':
        field = 'Rating';
        isDesc = true;
        break;
      case 'name':
        field = 'Name';
        isDesc = false;
        break;
      case 'newest':
        field = 'CreatedAt';
        isDesc = true;
        break;
    }

    this.productService.sortBy(field, isDesc).subscribe({
      next: (res) => {
        this.products.set(res);
      },
    });
  }

  chatVsilible = signal(false);

  toggleChat() {
    if (this.chatVsilible() === false) {
      this.chatVsilible.set(true);
    } else if (this.chatVsilible() === true) {
      this.chatVsilible.set(false);
    }
    console.log(this.chatVsilible());
  }

onChatSubmit() {
  if (this.chatForm.valid) {
    this.sub = this.productService.n8nwebhook(this.chatForm.value.text, this.chatForm.value.email).subscribe({
      next: (res) => {
       
        if (res && res.botResponse) {
        
          const trustedHtml = this.sanitizer.bypassSecurityTrustHtml(res.botResponse);
          this.n8nResponse.set({ botResponse: trustedHtml });
        } else {

          const trustedHtml = this.sanitizer.bypassSecurityTrustHtml(res);
          this.n8nResponse.set({ botResponse: trustedHtml });
        }
        console.log(this.n8nResponse());
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}

viewMessage(){
  return alert('თქვენი მესიჯი გაგზავნილია! დაელოდეთ პასუხს')

}


}

