import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { EpaycoCheckoutData, Product, ShoppigCartItem } from 'src/app/types';
import { ToastService } from 'src/app/services/toast.service';
import { formatPrice } from 'src/app/utils/utils';
import { HeaderComponent } from "src/app/components/header/header.component";
import { EpaycoService } from 'src/app/services/epayco.service';
import { AuthService } from 'src/app/services/auth.service';

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

  // Valores para los calculos
  subtotal: number = 0;
  base: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private alertService: AlertService,
    private toastService: ToastService,
    private productsService: ProductsService,
    private router: Router,
    private epaycoService: EpaycoService,
    private alertController: AlertController,
    private authService: AuthService,
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

    this.calculateTotals();

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
    this.alertService.presetConfirmActionAlert({
      header: 'Continuar',
      message: `Total a pagar: ${this.setFormatPrice(this.totalValue)}.`
    }).subscribe((confirmation) => {
      if (confirmation) {
        this.setEpaycoPayment();
      }
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

  // Métodos relacionados en el pago "real" conectados con ePayco

  // Función para calcular los impuestos
  async calculateTotals(): Promise<void> {
    this.subtotal = await this.shoppingCartService.getTotalValue() || 0;

    if (this.subtotal > 0) {
      const taxes = this.epaycoService.calculateTaxes(this.subtotal);

      this.base = taxes.base;
      this.iva = taxes.iva;
      this.total = taxes.total;
    }

    console.log({
      base: this.base,
      iva: this.iva,
      total: this.total
    })
  }

  // Función para crear descripción de la compra
  setPurchaseDesc(): string {
    const nameProducts = this.cartItems.
      map((item) => `${item.product.name} (x${item.quantity})`)
      .slice(0, 3)
      .join(', ');

    if (this.cartItems.length > 3) {
      return `${nameProducts} y ${this.cartItems.length - 3} más.`;
    }

    return nameProducts;
  }

  // Función para procesar pago con ePayco
  async processEpaycoPay(customerData: any): Promise<void> {
    await this.toastService.presentToast(
      'Preparando pago seguro',
      2000,
      'top',
      'secondary',
      'lock-closed-outline'
    );

    try {
      const numReceipt = this.epaycoService.generateReceiptNum();
      const descPurchase = this.setPurchaseDesc();
      const baseURL = window.location.origin;

      // Prepara data para ePayco
      const checkoutData: EpaycoCheckoutData = {
        name: 'Compra en EcoMarket',
        description: descPurchase,
        invoice: numReceipt,
        currency: 'cop',
        amount: Math.round(this.total).toString(),
        tax_base: Math.round(this.base).toString(),
        tax: Math.round(this.iva).toString(),
        country: 'co',
        lang: 'es',
        external: 'false',
        response: `${baseURL}/purchase-response`,
        confirmation: `${baseURL}/payment-confirmation`,
        name_billing: customerData.username,
        address_billing: customerData.direction,
        type_doc_billing: 'cc',
        number_doc_billing: customerData.document,
        mobile_phone_billing: customerData.tel,
        extra1: customerData.email,
        extra2: numReceipt,
        extra3: `Items: ${this.cartItems.length}`
      };

      await this.toastService.presentToast(
        'Abriendo pasarela de pagos',
        2000,
        'bottom',
        'success',
        'lock-closed-outline'
      );

      // Iniciar pago con ePayco
      this.epaycoService.initializedEpaycoCheckout(checkoutData);

      await this.shoppingCartService.cleanShoppingCart();
    } catch (error) {
      await this.toastService.presentToast(
        'Abriendo pasarela de pagos',
        2000,
        'top',
        'danger',
        'close-circle'
      );

      console.log('Ha ocurrido un error al iniciar el pago: ', error);
    }
  }

  // Método para mostrar ventanda para llevar al pago
  async setEpaycoPayment(): Promise<void> {
    console.log('Entro ha hacer el pago');

    const currentUser = await this.authService.getCurrentUser();

    const alert = await this.alertController.create({
      header: 'Datos para facturación',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Nombre completo',
          value: currentUser?.name || '',
          cssClass: 'custom-input'
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico',
          value: currentUser?.email || '',
          cssClass: 'custom-input'
        },
        {
          name: 'tel',
          type: 'text',
          placeholder: 'Teléfono',
          value: currentUser?.phone || '',
          cssClass: 'custom-input'
        },
        {
          name: 'document',
          type: 'text',
          placeholder: 'Número de documeto',
          cssClass: 'custom-input'
        },
        {
          name: 'direction',
          type: 'text',
          placeholder: 'Dirección',
          cssClass: 'custom-input'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Continuar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            this.processEpaycoPay(data);
          }
        }
      ]
    });

    await alert.present();
  }
}
