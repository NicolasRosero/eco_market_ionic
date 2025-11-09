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
  id: number,
  name: string;
  image?: string;
}

// Tipo del carrito de compras
export interface ShoppigCartItem {
  product: Product;
  quantity: number;
}

// Tipo para Epayco
export interface EpaycoCheckoutData {
  name: string;
  description: string;
  invoice: string;
  currency: string;
  amount: string;
  tax_base: string;
  tax: string;
  country: string;
  lang: string;
  external: string;
  extra1?: string;
  extra2?: string;
  extra3?: string;
  response: string;
  confirmation: string;
  name_billing: string;
  address_billing: string;
  type_doc_billing: string;
  number_doc_billing: string;
  mobile_phone_billing: string;
}

export interface ExportDataIVA {
  base: number;
  iva: number;
  total: number;
}
