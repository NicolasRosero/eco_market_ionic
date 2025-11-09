import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'shopping-cart',
    loadComponent: () => import('./pages/shopping-cart/shopping-cart.page').then(m => m.ShoppingCartPage),
    canActivate: [authGuard]
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage),
    canActivate: [authGuard]
  },
  {
    path: 'products-by-category',
    loadComponent: () => import('./pages/products-by-category/products-by-category.page').then(m => m.ProductsByCategoryPage),
    canActivate: [authGuard]
  },
  {
    path: 'admin-products',
    loadComponent: () => import('./pages/admin-products/admin-products.page').then(m => m.AdminProductsPage),
    canActivate: [authGuard]
  },
  {
    path: 'create-product',
    loadComponent: () => import('./pages/create-update-product/create-update-product.page').then(m => m.CreateUpdateProductPage),
    canActivate: [authGuard]
  },
  {
    path: 'update-product/:id',
    loadComponent: () => import('./pages/create-update-product/create-update-product.page').then(m => m.CreateUpdateProductPage),
    canActivate: [authGuard]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then( m => m.NotFoundPage)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];
