import { Injectable } from '@angular/core';
import { Category, Product } from '../types';
import { StorageService } from './storage.service';
import { productsDB } from 'src/DB';

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

      const savedProducts: Product[] = JSON.parse(await this.storageService.get(this.STORAGE_KEY)) || [];

      console.log('Productos: ', savedProducts)

      if (savedProducts && savedProducts.length > 0) {
        this.products = savedProducts;
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

      return this.products.filter((item) => item.category.name.toLowerCase() === category.toLowerCase());
    } catch (error) {
      console.error('Error al obtener los productos por categoría: ', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      await this.initProducts();

      const allCategories = this.products.map((item) => item.category);

      const uniqueCategories = new Map<string, Category>();

      allCategories.forEach((category) => {
        uniqueCategories.set(category.name, category);
      });

      return Array.from(uniqueCategories.values());
    } catch (error) {
      console.error('Error al obtener las categorías: ', error);
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
    const products: Product[] = productsDB;

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
