import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Product } from 'src/app/types';
import { formatPrice } from 'src/app/utils/utils';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class ProductsListComponent implements OnInit {
  @Input() products: Product[] = [];

  constructor(
    private alertService: AlertService,
    private shoppinCartService: ShoppingCartService,
    private router: Router
  ) { }

  ngOnInit() { }

  getTotalItems(): number {
    return this.products.reduce((sum, product) => sum + (product?.quantity || 0), 0);
  }

  getTotalPrice(): number {
    return this.products.reduce((sum, product) => sum + ((product?.quantity || 0) * product.price), 0);
  }

  async checkout(): Promise<void> {
    const totalItems = this.getTotalItems();
    const totalPriceFormatted = this.setFormatPrice(this.getTotalPrice());
    let itemsAddedCount = 0;

    if (totalItems === 0) {
      await this.alertService.presentBasicAlert({
        header: 'IMPORTANTE',
        message: 'No has seleccionado ningún producto para añadir.',
      });

      return;
    }

    // Añadir productos seleccionados al carrito
    for (const product of this.products) {
      const quantity = product.quantity || 0;

      if (quantity > 0) {
        const result = await this.shoppinCartService.addShoppingCartItem(product, quantity);

        if (result) {
          itemsAddedCount++;
        }

        // Limpiar selección del producto
        product.quantity = 0;
      }
    }

    if (itemsAddedCount > 0) {
      this.alertService.customActionsAlert(
        {
          header: '¡Exito!',
          message: `Productos añadidos satisfactoriamente al carrito.\nTotal de ítems: ${totalItems}\nValor total: ${totalPriceFormatted}`,
        },
        'Ir al carrito',
        'Continuar comprando',
        () => this.goToShoppingCart()
      );
    } else {
      await this.alertService.presentBasicAlert({
        header: 'IMPORTANTE',
        message: 'Ha ocurrido un error al añadir los productos al carrito.',
      });
    }
  }

  // Cambiar la cantidad de productos disponibles
  changeQuantity(product: Product, delta: number): void {
    const currentQuantity = product.quantity || 0;
    const newQuantity = currentQuantity + delta;

    // Si el usuario intenta restar y la cantidad ya es 0, no hacemos nada
    if (delta === -1 && currentQuantity === 0) {
      return;
    }

    // Evitar cantidad negativa (aunque ya lo cubre el punto 2, es bueno reforzar)
    if (newQuantity < 0) {
      product.quantity = 0;
      return;
    }

    // Evitar agregar si no hay stock disponible (solo aplica si delta es +1)
    if (delta === 1 && product.stock === 0) {
      return;
    }

    // Si delta es +1 (Añadir), el stock disminuye (delta es +1, -delta es -1)
    // Si delta es -1 (Eliminar), el stock aumenta (delta es -1, -delta es +1)
    product.quantity = newQuantity;
  }

  // Establecer el producto como agotado
  markNotedProductsAsOutOfStock(count: number): void {
    const notedProducts = this.products.filter(p => p.noted && p.stock > 0);

    const productsToMark: Product[] = [];

    // Prioriza destacados
    while (productsToMark.length < count && notedProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * notedProducts.length);
      productsToMark.push(notedProducts.splice(randomIndex, 1)[0]);
    }

    productsToMark.forEach((product) => {
      product.stock = 0;
    });
  }

  // Limpiar listado de productos escogidos
  async clearCart(): Promise<void> {
    if (this.getTotalItems() === 0) {
      return;
    }

    this.alertService.presetConfirmActionAlert(
      {
        header: 'Confirmar Eliminación',
        message: '¿Desea eliminar **todos** sus productos del carrito?',
      },
      'Sí, Eliminar',
      'Cancelar'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.products.forEach((p) => {
          if ((p?.quantity ?? 0) > 0) {
            p.quantity = 0; // Vacía la cantidad en el carrito
          }
        });
      }
    });
  }

  goToShoppingCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  setFormatPrice(price: number): string {
    return formatPrice(price);
  }
}
