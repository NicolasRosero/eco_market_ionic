import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "src/app/components/header/header.component";
import { ProductsService } from 'src/app/services/products.service';
import { Category } from 'src/app/types';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent]
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];

  constructor(
    private productsService: ProductsService,
    private storageService: StorageService,
    private router: Router

  ) {
    setTimeout(async () => {
      this.categories = await this.productsService.getCategories();
    });
  }

  ngOnInit() { }

  setCagetory(category: string): void {
    this.storageService.set('category', category);
    this.goToProductsByCategory();
  }

  private goToProductsByCategory(): void {
    this.router.navigate(['/products-by-category']);
  }
}
