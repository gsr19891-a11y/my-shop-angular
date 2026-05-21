import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Auth } from './pages/auth/auth';
import { Shop } from './pages/shop/shop';
import { ProductInfo } from './pages/product-info/product-info';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { VerifyEmail } from './pages/auth/verify-email/verify-email';
import { DescriptionPage } from './pages/product-info/description-page/description-page';
import { ReviewsPage } from './pages/product-info/reviews-page/reviews-page';
import { UserPage } from './components/user/user-page/user-page';
import { UserProfile } from './components/user/userComponents/user-profile/user-profile';
import { CardPage } from './components/user/userComponents/card-page/card-page';
import { FavoritesPage } from './components/user/userComponents/favorites-page/favorites-page';
import { SettingsPage } from './components/user/userComponents/settings-page/settings-page';
import { ErrorPage } from './components/error-page/error-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: Shop },
  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'verify/:email', component: VerifyEmail },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'product-info/:id',
    component: ProductInfo,
    children: [
      { path: 'description', component: DescriptionPage },
      { path: 'reviews', component: ReviewsPage },
      { path: '', redirectTo: 'description', pathMatch: 'full' },
    ],
  },
  {
    path: 'user',
    component: UserPage,
    children: [
      { path: 'user-profile', component: UserProfile },
      { path: 'card-page', component: CardPage },
      { path: 'favorites', component: FavoritesPage },
      { path: 'settings', component: SettingsPage },
      { path: '', redirectTo: 'user-profile', pathMatch: 'full' },
    ],
  },
  { path: '**', component: ErrorPage },
];
