import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { ShoppigCartItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCart {
  private STORAKE_KEY = 'shoppingCart';
  private items: ShoppigCartItem[] = [];

  constructor(
    private storageService: StorageService
  ) { }

  // Obtener el carrito desde el Storage

  // Guardar el carrito al storage

  // Obtener los productos/items del carrito

  // Agregar producto al carrito

  // Actualizar cantidad de un producto

  // Eliminar producto del carrito

  // Obtener cantidad de productos en el carrito

  // Cálcular el total del carrito

  // Verificar si un producto ya fue agregado al carrito

  // Limpiar carrito
}
