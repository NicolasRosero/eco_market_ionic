import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { HeaderComponent } from "src/app/components/header/header.component";
import { Product } from 'src/app/types'
import { productsDB } from 'src/DB';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];

  constructor(
    private toastService: ToastService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.products = productsDB.map((p) => ({
      ...p,
      quantity: 0
    })) as Product[];
  }

  getTotalItems(): number {
    return this.products.reduce((sum, product) => sum + (product?.quantity || 0), 0);
  }

  getTotalPrice(): number {
    return this.products.reduce((sum, product) => sum + ((product?.quantity || 0) * product.price), 0);
  }

  async checkout(): Promise<void> {
    const totalItems = this.getTotalItems();
    const totalPriceFormatted = this.formatPrice(this.getTotalPrice());

    if (totalItems === 0) {
      return;
    }

    const alert = await this.alertController.create({
      header: '¡Pago Exitoso!',
      message: `Productos añadidos satisfactoriamente al carrito.\nTotal de ítems: ${totalItems}\nValor total: ${totalPriceFormatted}`,
      buttons: [
        {
          text: 'Ir al Carrito',
          handler: () => {
            // Resetear las cantidades después de "pagar"
            this.products.forEach((p) => {
              p.quantity = 0;
            });
          },
        },
        {
          text: 'Continuar Comprando',
          role: 'cancel'
        }
      ],
    });

    await alert.present();
  }

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
    product.stock -= delta;
    product.quantity = newQuantity;
  }

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

  async clearCart(): Promise<void> {
    if (this.getTotalItems() === 0) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Desea eliminar **todos** sus productos del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, Eliminar',
          cssClass: 'danger-button',
          handler: () => {
            // Vaciar el carrito y devolver stock
            this.products.forEach((p) => {
              if ((p?.quantity ?? 0) > 0) {
                p.stock += (p?.quantity ?? 0); // Devuelve la cantidad al stock
                p.quantity = 0; // Vacía la cantidad en el carrito
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  }
}
