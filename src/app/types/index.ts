// Tipos para ToastController
export type toastPosition = 'top' | 'middle' | 'bottom';
export type toastColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';

// Tipos para AlertController
export interface AlertOptions {
  header: string;
  message: string;
  subHeader?: string;
  backdropDismiss?: boolean;
  cssClass?: string;
}

// Estructura de información de usuario
export interface User {
  name: string;
  email: string;
  phone: string;
  rol: string;
  password: string;
  userAgreeTerms: boolean;
  photo?: string;
}

// Estructura de retorno del servicio de autenticación
export interface AuthUserResp {
  message: string;
  state: boolean;
}

// Estructura de los productos
export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image?: string;
  category: Category;
  stock: number;
  noted?: boolean;
  quantity?: number;
}

export interface Category {
  name: string;
  image?: string;
}

// Tipo del carrito de compras
export interface ShoppigCartItem {
  product: Product;
  quantity: number;
}
