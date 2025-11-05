import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { Product, ShoppigCartItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private STORAKE_KEY = 'shoppingCart';
  private items: ShoppigCartItem[] = [];

  constructor(
    private storageService: StorageService
  ) { }

  // Obtener el carrito desde el Storage
  private async setShoppingCart(): Promise<void> {
    const shoppingCartSaved = await this.storageService.get(this.STORAKE_KEY);

    this.items = JSON.parse(shoppingCartSaved) || [];
  }

  // Guardar el carrito al storage
  private async saveShoppingCart(): Promise<void> {
    await this.storageService.set(this.STORAKE_KEY, JSON.stringify(this.items));
  }

  // Obtener los productos/items del carrito
  async setShoppingCartItems(): Promise<ShoppigCartItem[]> {
    try {
      await this.setShoppingCart();

      return [...this.items];
    } catch (error) {
      console.error('Ha ocurrido un error al obtener los items del carrito');
      return [];
    }
  }

  // Agregar producto al carrito
  async addShoppingCartItem(product: Product, quantity: number = 1): Promise<boolean> {
    try {
      await this.setShoppingCart();

      // Verificar item existente
      const existingItem = this.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity });
      }

      // Guardar carrito
      await this.saveShoppingCart();

      return true;
    } catch (error) {
      console.error('Ha ocurrido un error al añadir el item al carrito');
      return false;
    }
  }

  // Actualizar cantidad de un producto
  async updateProductQuantity(idProduct: number, newQuantity: number): Promise<boolean> {
    try {
      await this.setShoppingCart();

      // Verificar item existente
      const existingItem = this.items.find((item) => item.product.id === idProduct);

      if (existingItem) {
        if (newQuantity <= 0) {
          return await this.deleteProductInShoppingCart(idProduct);
        }

        existingItem.quantity = newQuantity;

        // Guardar carrito
        await this.saveShoppingCart();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar la cantidad del producto en el carrito');
      return false;
    }
  }

  // Eliminar producto del carrito
  async deleteProductInShoppingCart(idProduct: number): Promise<boolean> {
    try {
      await this.setShoppingCart();

      // Verificar item existente
      const existingItem = this.items.find((item) => item.product.id === idProduct);

      if (existingItem) {
        this.items.splice(this.items.indexOf(existingItem), 1);
        this.saveShoppingCart();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Ha ocurrido un error al eliminar el producto del carrito');
      return false;
    }
  }

  // Obtener cantidad de todos los productos en el carrito
  async getQuantityAllProduct(): Promise<number | null> {
    try {
      await this.setShoppingCart();

      return this.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Ha ocurrido un error al consultar la cantidad de los productos en el carrito');
      return null;
    }
  }

  // Obtener cantidad de un producto en el carrito
  async getQuantityOneProduct(idProduct: number): Promise<number | null> {
    try {
      await this.setShoppingCart();

      const item = this.items.find((item) => item.product.id === idProduct);

      return item ? item.quantity : 0;
    } catch (error) {
      console.error('Ha ocurrido un error al consultar la cantidad del producto en el carrito');
      return null;
    }
  }

  // Cálcular el total del carrito
  async getTotalValue(): Promise<number | null> {
    try {
      await this.setShoppingCart();

      return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    } catch (error) {
      console.error('Ha ocurrido un error al consultar el valor total ($) del carrito');
      return null;
    }
  }

  // Verificar si un producto ya fue agregado al carrito
  async validProductInShoppingCart(idProduct: number): Promise<boolean | null> {
    try {
      await this.setShoppingCart();

      return this.items.some((item) => item.product.id === idProduct);
    } catch (error) {
      console.error('Ha ocurrido un error al consultar el valor total ($) del carrito');
      return null;
    }
  }

  // Limpiar carrito
  async cleanShoppingCart(): Promise<void> {
    this.items = [];

    // Guardar carrito
    await this.saveShoppingCart();
  }
}
