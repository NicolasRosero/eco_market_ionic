import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Category, Product } from 'src/app/types';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.page.html',
  styleUrls: ['./create-update-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HeaderComponent],
})
export class CreateUpdateProductPage implements OnInit {
  productForm: FormGroup;
  isEditing: boolean = false;
  categories: Category[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {
    this.productForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      precio: [null, [Validators.required]],
      category: ['', Validators.required],
      stock: ['', [Validators.required]],
      noted: ['', Validators.required],
    });

    this.activeRoute.paramMap.subscribe((params: any) => {
      const id = params.get('id') || null;

      if (id) {
        this.isEditing = true;
        this.getProductById(parseInt(id));
      }
    });
  }

  async ngOnInit() {
    this.getCategories();
  }

  async getCategories(): Promise<void> {
    this.categories = await this.productService.getCategories();
  }

  async getProductById(productId: number): Promise<void> {
    const product: Product | undefined = await this.productService.getProductById(productId);

    if(product) {
      this.productForm.controls['name'].setValue(product.name);
      this.productForm.controls["description"].setValue(product.desc);
      this.productForm.controls['precio'].setValue(product.price);
      this.productForm.controls['stock'].setValue(product.stock);
    }
  }

  async saveData(): Promise<void> {
    if (this.isEditing) {
      // Editar
    } else {
      // Crear
    }
  }
}
