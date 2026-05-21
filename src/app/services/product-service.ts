import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ProductResponse } from '../interface/product-response';
import { ProductIdInterfaceFull } from '../interfaceById/product-id-interface-full';
import { ApiService } from './api-service';
import { ReviewsInterface } from '../interface/reviews-interface';
import { AuthService } from './auth-service';
import { CarResponse } from '../interface/cartInterface/cart-response';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  allFavoritesCart = signal<any[]>([]);

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  getProducts(filters?: any) {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.append(key, filters[key].toString());
        }
      });
    }

    return this.http.get<ProductResponse>(this.apiService.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
      },
      params: params,
    });
  }

  getProductById(id: number) {
    return this.http.get<ProductIdInterfaceFull>(this.apiService.baseUrl + `/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
      },
    });
  }

  Search(form: any) {
    return this.http.get(this.apiService.baseUrl + `/Search?query=${form}&Take=10&Page=1`, {
      headers: {
        'x-api-key': this.apiService.XAPIKEY(),
      },
    });
  }

  filterProducts(f: any) {
    const take = f.pageSize || 8;
    const page = f.page || 1;
    const catId = f.categoryId === 0 || !f.categoryId ? '' : f.categoryId;

    const url =
      this.apiService.baseUrl +
      `/filter?` +
      `Search=${f.search || ''}&` +
      `MinPrice=${f.minPrice ?? 0}&` +
      `MaxPrice=${f.maxPrice ?? 9999}&` +
      `CategoryId=${catId}&` +
      `MinRating=${f.minRating ?? 0}&` +
      `SortBy=${f.SortBy}&` +
      `SortDescending=${f.SortDescending || false}&` +
      `Take=${take}&` +
      `Page=${page}`;

    return this.http.get(url, {
      headers: { 'x-api-key': this.apiService.XAPIKEY() },
    });
  }

  reviews(id: number) {
    return this.http.get<ReviewsInterface>(`https://shopapi.stepacademy.ge/api/reviews/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
      },
    });
  }

  addReview(id: number, rate: number) {
    const data = localStorage.getItem('userToken');

    let token = '';
    if (data) {
      try {
        const parsed = JSON.parse(data);
        token = parsed.data?.accessToken || '';
      } catch {}
    }

    return this.http.post(
      'https://shopapi.stepacademy.ge/api/reviews',
      {
        productId: id,
        rate: rate,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  //cart services

  allCart() {
    const token = this.authService.getToken();

    const url = `${this.apiService.cartUrl}?Take=50&Page=1`;

    return this.http
      .get<CarResponse>(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(tap((res: any) => this.cartCount.set(res?.data?.totalCount || 0)));
  }

  addToCart(payload: any) {
    const token = this.authService.getToken();

    return this.http.post(this.apiService.cartUrl + '/add-to-cart', payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  editQuantity(payload: any) {
    const token = this.authService.getToken();

    return this.http.put(this.apiService.cartUrl + '/edit-quantity', payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  removeFromCart(productId: number) {
    const token = this.authService.getToken();
    return this.http.delete(`${this.apiService.cartUrl}/remove-from-cart/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  removeAllCart(productId: number) {
    const token = this.authService.getToken();
    const url = `https://shopapi.stepacademy.ge/api/cart/remove-from-cart/${productId}`;

    return this.http.delete(url, {
      headers: {
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  checkout() {
    const token = this.authService.getToken();
    return this.http.post(
      'https://shopapi.stepacademy.ge/api/users/checkout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  //favorites=================================================

  getFavorites() {
    const token = this.authService.getToken();
    return this.http
      .get<CarResponse>(this.apiService.favoritesUrl + '?Take=50&Page=1', {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((res: any) => {
          setTimeout(() => {
            this.allFavoritesCart.set(res?.data?.items || []);
            this.favoriteCount.set(res?.data?.totalCount || 0);
          });
        }),
      );
  }

  addToFavorites(id: number) {
    const token = this.authService.getToken();
    return this.http
      .post(
        this.apiService.favoritesUrl + `/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiService.XAPIKEY(),
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(tap((res: any) => this.allFavoritesCart.set(res?.data?.items || [])));
  }

  //allFavoritesCart
  deleteFromFavorites(id: number) {
    const token = this.authService.getToken();
    return this.http.delete(this.apiService.favoritesUrl + `/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateReview(reviewId: number, rate: number) {
    const token = this.authService.getToken();
    return this.http.put(
      'https://shopapi.stepacademy.ge/api/reviews',
      { reviewId, rate },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  deleteReview(productId: number) {
    return this.http.delete(`https://shopapi.stepacademy.ge/api/reviews/${productId}`, {
      headers: {
        'x-api-key': this.apiService.XAPIKEY(),
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  productFilter(
    search: string,
    brand: string,
    minPrice: number,
    maxPrice: number,
    sortBy: string,
    sortDescending: boolean,
    page: number,
    take: number,
  ) {
    return this.http.get<any>(
      `https://shopapi.stepacademy.ge/api/products/filter?Search=${search}&Brand=${brand}&MinPrice=${minPrice}&MaxPrice=${maxPrice}&SortBy=${sortBy}&SortDescending=${sortDescending}&Page=${page}&Take=${take}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiService.XAPIKEY(),
        },
      },
    );
  }

  sortBy(sort: string, sortDescending: boolean) {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiService.XAPIKEY(),
    };

    const params = new HttpParams()
      .set('SortBy', sort)
      .set('SortDescending', sortDescending.toString());

    return this.http.get<ProductResponse>(`https://shopapi.stepacademy.ge/api/products/filter`, {
      headers,
      params,
    });
  }

  favoriteCount = signal<number>(0);

  cartCount = signal<number>(0);
}
