import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProductsPage implements OnInit {
  products = [
    { id: 1, nombre: 'Bolsa ecológica', cantidad: 0, stock: 5 },
    { id: 2, nombre: 'Termo reciclable', cantidad: 0, stock: 3 },
    { id: 3, nombre: 'Camiseta Eco', cantidad: 0, stock: 0 },
  ];

  constructor(
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() { }

  async agregar(product: any) {
    if (product.stock > product.cantidad) {
      product.cantidad++;

      this.toastService.presentToast(
        `Se agregó ${product.nombre}. Total: ${product.cantidad}`,
        1500,
        'bottom',
        'success',
        'checkmark-circle'
      );
    } else {
      this.toastService.presentToast(
        'Este producto está agotado',
        1500,
        'bottom',
        'danger',
        'alert-circle'
      );
    }
  }

  async eliminar(product: any) {
    if (product.cantidad > 0) {
      product.cantidad--;

      this.toastService.presentToast(
        `Se eliminó 1 ${product.nombre}`,
        1500,
        'bottom',
        'warning',
        'alert-circle'
      );
    }
  }
}
