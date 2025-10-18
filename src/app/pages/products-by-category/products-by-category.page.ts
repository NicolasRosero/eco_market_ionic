import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { StorageService } from 'src/app/services/storage.service';
import { Category, Product } from 'src/app/types';
import { HeaderComponent } from "src/app/components/header/header.component";
import { IonicModule } from '@ionic/angular';
import { ProductsListComponent } from "src/app/components/products-list/products-list.component";

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.page.html',
  styleUrls: ['./products-by-category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, ProductsListComponent]
})
export class ProductsByCategoryPage implements OnInit, OnDestroy {
  private loadProductsTimer: any | undefined;
  category: Category | null = null;
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.getProductsByCategory();
  }

  async getProductsByCategory(): Promise<void> {
    const category = await this.storageService.get('category');

    this.loadProductsTimer = setTimeout(async () => {
      this.products = await this.productsService.getProductsByCategory(category);

      // Obtener la categoría
      const allSameCategory = this.products.map((item) => item.category);
      const uniqueCategory = new Map<string, Category>()

      allSameCategory.forEach((item) => {
        uniqueCategory.set(item.name, item);
      });

      const categoryToPrint = Array.from(uniqueCategory.values())[0];
      this.category = categoryToPrint;
    }, 700);
  }

  ngOnDestroy(): void {
    if (this.loadProductsTimer) {
      clearTimeout(this.loadProductsTimer);
    }
  }
}
