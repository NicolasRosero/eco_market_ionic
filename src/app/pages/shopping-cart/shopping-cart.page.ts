import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { Product, ShoppigCartItem } from 'src/app/types';
import { ToastService } from 'src/app/services/toast.service';
import { formatPrice } from 'src/app/utils/utils';
import { HeaderComponent } from "src/app/components/header/header.component";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class ShoppingCartPage implements OnInit {
  cartItems: ShoppigCartItem[] = [];
  totalValue: number = 0;
  totalItems: number = 0;
  isLoading: boolean = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private alertService: AlertService,
    private toastService: ToastService,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit() { }

  async ionViewWillEnter(): Promise<void> {
    await this.loadCartData();
  }

  // Función para cargar la info del carrito
  async loadCartData(): Promise<void> {
    this.isLoading = true;

    this.cartItems = await this.shoppingCartService.setShoppingCartItems();
    this.totalValue = await this.shoppingCartService.getTotalValue() || 0;
    this.totalItems = await this.shoppingCartService.getQuantityAllProduct() || 0;

    this.isLoading = false;
  }

  // Función para el manejo de la cantidad de los productos en el carrito
  async updateQuantity(item: ShoppigCartItem, delta: number): Promise<void> {
    const newQuantity = item.quantity + delta;
    const produtc: Product | undefined = await this.productsService.getProductById(item.product.id);

    if (!produtc) {
      await this.toastService.presentToast(
        'Producto no encontrado',
        2000,
        'bottom',
        'danger',
        'close-circle'
      );

      return;
    }

    // Validación del stock al aumentar la cantidad
    if (delta > 0 && newQuantity > produtc.stock) {
      await this.toastService.presentToast(
        'No hay más stock disponible',
        2000,
        'bottom',
        'warning',
        'alert-circle'
      );

      return;
    }

    // Validación de cantidad mínima de productos
    if (newQuantity < 0) return;

    // Actualizar cantidad de producto en el carrito
    const result = await this.shoppingCartService.updateProductQuantity(item.product.id, newQuantity);

    if (result) {
      await this.loadCartData();
    } else {
      await this.toastService.presentToast(
        'No se pudo actualizar la cantidad del producto en el carrito',
        2000,
        'bottom',
        'danger',
        'close-circle'
      );
    }
  }

  // Función para eliminar un producto del carrito
  async deleteItem(idProduct: number): Promise<void> {
    this.alertService.presetConfirmActionAlert(
      {
        header: 'Confirmar',
        message: '¿Desea eliminar este producto del carrito?'
      },
      'Sí, eliminar',
      'Cancelar'
    ).subscribe(async (confirmation) => {
      if (confirmation) {
        const result = await this.shoppingCartService.deleteProductInShoppingCart(idProduct);

        if (result) {
          await this.toastService.presentToast(
            'Producto eliminado correctamente',
            2000,
            'top',
            'success',
            'checkmark-circle'
          );

          await this.loadCartData();
        } else {
          await this.toastService.presentToast(
            'No se puedo eliminar el producto',
            2000,
            'bottom',
            'danger',
            'close-circle'
          );
        }
      }
    });
  }

  // Función para realizar pago
  async goToCheckout(): Promise<void> {
    if (this.totalItems === 0) {
      await this.toastService.presentToast(
        'El carrito está vacío',
        2000,
        'bottom',
        'warning',

      );

      return;
    }

    // Aquí iría la lógica de navegación al pago o la confirmación de la compra
    this.alertService.presentBasicAlert({
      header: 'Continuar',
      message: `Total a pagar: ${this.setFormatPrice(this.totalValue)}.`
    });
  }

  // Función para limpiar el carrito
  async clearCart(): Promise<void> {
    if (this.totalItems === 0) return;

    this.alertService.presetConfirmActionAlert(
      {
        header: 'Confirmar Eliminación',
        message: '¿Desea eliminar TODOS los productos del carrito?',
      },
      'Vaciar',
      'Cancelar'
    ).subscribe(async (confirmed) => {
      if (confirmed) {
        await this.shoppingCartService.cleanShoppingCart();
        await this.loadCartData();
        await this.toastService.presentToast(
          'Carrito vaciado exitosamente.',
          2000,
          'bottom',
          'success',
          'checkmark-outline'
        );
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  setFormatPrice(price: number): string {
    return formatPrice(price);
  }
}
