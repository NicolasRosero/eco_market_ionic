import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "src/app/components/header/header.component";
import { Product } from 'src/app/types'
import { productsDB } from 'src/DB';
import { ProductsListComponent } from "src/app/components/products-list/products-list.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, ProductsListComponent]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];

  constructor() { }

  ngOnInit() {
    this.products = productsDB.map((p) => ({
      ...p,
      quantity: 0
    })) as Product[];
  }
}
