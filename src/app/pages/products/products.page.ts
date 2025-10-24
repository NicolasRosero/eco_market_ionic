import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "src/app/components/header/header.component";
import { Product } from 'src/app/types'
import { ProductsListComponent } from "src/app/components/products-list/products-list.component";
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, ProductsListComponent]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts(): Promise<void> {
    this.products = await this.productsService.getProducts();
  }
}
