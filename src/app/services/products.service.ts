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
      if (this.initialized) return this.products;

      const savedProducts: Product[] = JSON.parse(await this.storageService.get(this.STORAGE_KEY)) || [];

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

  // Guardar los productos de forma global
  private async saveProducts(): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, JSON.stringify(this.products));
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

  async addNewProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      await this.initProducts();

      const newIdProduct = this.products.length > 0
        ? Math.max(...this.products.map((item) => item.id)) + 1
        : 1;

      const newProduct: Product = {
        id: newIdProduct,
        ...product
      }

      this.products.push(newProduct);

      await this.saveProducts();

      return newProduct;
    } catch (error) {
      console.error('Ha ocurrido un error al crear el producto: ', error);
      return null;
    }
  }

  async updateProduct(id: number, existingProduct: Partial<Product>): Promise<boolean> {
    try {
      await this.initProducts();

      // Buscar producto
      const productIndex = this.products.findIndex((item) => item.id === id);

      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          ...existingProduct,
          id
        }

        await this.saveProducts();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Ha ocurrido un error al editar el producto: ', error);
      return false;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      // Buscar producto
      const productIndex = this.products.findIndex((item) => item.id === id);

      if (productIndex !== -1) {
        this.products.splice(productIndex, 1);

        await this.saveProducts();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Ha ocurrido un error al eliminar el producto: ', error);
      return false;
    }
  }

  async updateStock(id: number, newStock: number): Promise<boolean> {
    try {
      return await this.updateProduct(id, { stock: newStock });
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar el stock del producto: ', error);
      return false;
    }
  }

  async reduceStock(id: number, quantity: number): Promise<boolean> {
    try {
      await this.initProducts();

      const product = this.products.find((item) => item.id === id);

      if (product && product.stock >= quantity) {
        product.stock -= quantity;

        await this.saveProducts();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Ha ocurrido un error al reducir el stock del producto: ', error);
      return false;
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

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      await this.initProducts();

      return this.products.find((item) => item.id === id);
    } catch (error) {
      console.error('Error al obtener el producto por id: ', error);
      return undefined;
    }
  }

  // Buscar producto por término de búsqueda
  async searchProductByQuery(query: string): Promise<Product[]> {
    try {
      await this.initProducts();

      const queryLower = query.toLowerCase();

      return this.products.filter(
        (item) => item.name.toLowerCase().includes(queryLower) ||
        item.category.name.toLowerCase().includes(queryLower) ||
        item.desc.toLowerCase().includes(queryLower)
      );
    } catch (error) {
      console.error('Error al obtener los productos por término: ', error);
      return [];
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
