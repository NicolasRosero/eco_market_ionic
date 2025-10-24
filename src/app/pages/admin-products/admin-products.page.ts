import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { IonicModule } from '@ionic/angular';
import { Product } from 'src/app/types';
import { HeaderComponent } from "src/app/components/header/header.component";
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.page.html',
  styleUrls: ['./admin-products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class AdminProductsPage implements OnInit {
  products: Product[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts(): Promise<void> {
    this.products = await this.productsService.getProducts();
  }

  goToCreateProducto() {
    this.router.navigate(['/create-product']);
  }

  goToEditProduct(idProduct: number): void {
    this.router.navigate(['/update-product', idProduct]);
  }

  async deleteProduct(product: Product): Promise<void> {
    this.alertService.presetConfirmActionAlert(
      {
        header: 'Alerta',
        message: `¿Está seguro de eliminar el producto ${product.name}?`
      }
    ).subscribe(async (confirmation) => {
      if (confirmation) {
        const resp = await this.productsService.deleteProduct(product.id);

        if (resp) {
          this.alertService.presentBasicAlert(
            {
              header: 'Alerta',
              message: 'Producto eliminado correctamente'
            }
          );

          this.getProducts();
        } else {
          this.alertService.presentBasicAlert(
            {
              header: 'Error',
              message: 'Ha ocurrido un error al eliminar el producto'
            }
          );
        }
      }
    });
  }
}
