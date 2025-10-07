import { Injectable } from '@angular/core';
import { Product } from '../types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private STORAGE_KEY = 'products';
  private products: Product[] = [];
  private initialized = false;

  constructor(
    private storageService: StorageService
  ) { }

  async initProducts(): Promise<Product[]> {
    try {
      if(this.initialized) return this.products;

      const savedProducts: Product[] = await this.storageService.get(this.STORAGE_KEY);

      if (savedProducts && savedProducts.length > 0) {
        this.products = savedProducts
      } else {
        console.log('No se encontrarón productos en el storage, estableciendo por defecto');

        await this.setDefaultProducts();

        this.products = await this.getDefaultProducts();
      }

      this.initialized = true;

      return this.products;
    } catch (error) {
      console.error('Ha ocurrido un error al consultar los productos: ', error);
      return [];
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      await this.initProducts();

      return this.products;
    } catch (error) {
      console.error('Error al obtener los productos: ', error);
      return [];
    }
  }

  async getNotedProducts(): Promise<Product[]> {
    try {
      await this.initProducts();

      return this.products.filter((item) => item.noted === true);
    } catch (error) {
      console.error('Error al obtener los productos: ', error);
      return [];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      await this.initProducts();

      return this.products.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    } catch (error) {
      console.error('Error al obtener los productos por categoría: ', error);
      return [];
    }
  }

  async getProductById(id: number): Promise<Product|undefined> {
    try {
      await this.initProducts();

      return this.products.find((item) => item.id === id);
    } catch (error) {
      console.error('Error al obtener el producto por id: ', error);
      return undefined;
    }
  }

  private async setDefaultProducts(): Promise<void> {
    const products: Product[] = [
      {
        id: 1,
        name: "Cepillo de Bambú Ecológico",
        desc: "Cepillo dental hecho con mango de bambú biodegradable y cerdas suaves libres de BPA.",
        price: 12000,
        image: "https://example.com/cepillo-bambu.jpg",
        category: "Higiene personal",
        stock: 50,
        noted: true
      },
      {
        id: 2,
        name: "Botella Reutilizable de Acero Inoxidable",
        desc: "Botella térmica libre de plásticos, mantiene las bebidas frías o calientes por horas.",
        price: 68000,
        image: "https://example.com/botella-acero.jpg",
        category: "Reutilizables",
        stock: 30
      },
      {
        id: 3,
        name: "Bolsa de Tela Orgánica",
        desc: "Bolsa de algodón orgánico ideal para compras, resistente y lavable.",
        price: 25000,
        image: "https://example.com/bolsa-tela.jpg",
        category: "Accesorios",
        stock: 40,
        noted: false
      },
      {
        id: 4,
        name: "Shampoo Sólido Natural",
        desc: "Elaborado con aceites esenciales, sin sulfatos ni plásticos. Ideal para cabello normal.",
        price: 32000,
        image: "https://example.com/shampoo-solido.jpg",
        category: "Cuidado personal",
        stock: 25,
        noted: false
      },
      {
        id: 5,
        name: "Kit de Cubiertos Reutilizables",
        desc: "Set de cubiertos de bambú con estuche de tela. Perfecto para llevar y evitar plásticos de un solo uso.",
        price: 28000,
        image: "https://example.com/cubiertos-bambu.jpg",
        category: "Reutilizables",
        stock: 35,
        noted: true
      }
    ];

    await this.storageService.set(this.STORAGE_KEY, JSON.stringify(products));
  }

  private async getDefaultProducts(): Promise<Product[]> {
    try {
      const defaultProducts = await this.storageService.get(this.STORAGE_KEY);
      return JSON.parse(defaultProducts);
    } catch (error) {
      console.error('Error al consultar los productos por defecto: ', error);
      return []
    }
  }
}
