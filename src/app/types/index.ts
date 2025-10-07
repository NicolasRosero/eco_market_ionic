// Tipos para ToastController
export type toastPosition = 'top' | 'middle' | 'bottom';
export type toastColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';

// Estructura de los productos
export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  noted?: boolean;
}
