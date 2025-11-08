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
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Category, Product } from 'src/app/types';
import { formatPrice, parsePriceToInteger } from 'src/app/utils/utils';
import { ToastService } from 'src/app/services/toast.service';

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
  product: Product | undefined = undefined;
  categories: Category[] = [];

  // Validaciones para el formulario
  numberRegex = /^\d*$/;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private toastService: ToastService
  ) {
    this.productForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.pattern(this.numberRegex)]],
      noted: ['', Validators.required],
    });
  }

  async ngOnInit() {
    // Consultar las categorías
    this.getCategories();

    // Consultar producto para edición
    this.activeRoute.paramMap.subscribe((params: any) => {
      const id = params.get('id') || null;

      if (id) {
        this.isEditing = true;
        this.getProductById(parseInt(id));
      }
    });
  }

  async getCategories(): Promise<void> {
    this.categories = await this.productService.getCategories();
  }

  async getProductById(productId: number): Promise<void> {
    this.product = await this.productService.getProductById(productId);

    if (this.product) {
      this.productForm.controls['name'].setValue(this.product.name);
      this.productForm.controls["description"].setValue(this.product.desc);
      this.productForm.controls['price'].setValue(formatPrice(this.product.price));
      this.productForm.controls['stock'].setValue(this.product.stock);
      this.productForm.controls['category'].setValue(this.product.category);

      const notedValueString = this.product.noted ? 'true' : 'false';
      this.productForm.controls['noted'].setValue(notedValueString);
    }
  }

  validForm(): boolean {
    // Validación general
    if (this.productForm.invalid) {
      this.productForm.markAllAsDirty();
      return false;
    }

    return true;
  }

  async saveData(): Promise<void> {
    if (!this.validForm()) return;

    if (this.isEditing) {
      const dataToSave: Partial<Product> = {
        name: this.productForm.controls['name'].value,
        price: parsePriceToInteger(this.productForm.controls['price'].value) || 0,
        category: this.productForm.controls['category'].value,
        stock: this.productForm.controls['stock'].value,
        noted: this.productForm.controls['noted'].value === 'true' ? true : false,
        desc: this.productForm.controls['description'].value?.toString()?.trim()
      }

      if (this.product?.id) {
        const result = await this.productService.updateProduct(this.product?.id, dataToSave);

        if (result) {
          this.toastService.presentToast(
            'Producto actualizado correctamente',
            2000,
            'bottom',
            'success',
            'checkmark-circle'
          );

          setTimeout(() => {
            this.goBack();
          }, 2500);
        } else {
          this.toastService.presentToast(
            'Ha ocurrido un error al actualizar el producto',
            2000,
            'bottom',
            'danger',
            'close-circle'
          );

          console.error('Ha ocurrido un error al actualizar el producto');
        }
      } else {
        this.toastService.presentToast(
          'No se encontró el producto a actualizar',
          2000,
          'bottom',
          'warning',
          'alert-circle'
        );
      }
    } else {
      const dataToSave: Omit<Product, 'id'> = {
        name: this.productForm.controls['name'].value,
        price: parsePriceToInteger(this.productForm.controls['price'].value) || 0,
        category: this.productForm.controls['category'].value,
        stock: this.productForm.controls['stock'].value,
        noted: this.productForm.controls['noted'].value === 'true' ? true : false,
        desc: this.productForm.controls['description'].value?.toString()?.trim(),
        image: 'assets/images/producto_skeleton.png',
      }

      const result = await this.productService.addNewProduct(dataToSave);

      if (result) {
        this.toastService.presentToast(
          'Producto agregado correctamente',
          2000,
          'bottom',
          'success',
          'checkmark-circle'
        );

        setTimeout(() => {
          this.goBack();
        }, 2500);
      } else {
        this.toastService.presentToast(
          'Ha ocurrido un error al agregar el producto',
          2000,
          'bottom',
          'danger',
          'close-circle'
        );

        console.error('Ha ocurrido un error al agregar el producto');
      }
    }
  }

  compareCategories(category1: Category, category2: Category): boolean {
    return category1 && category2 ? category1.name === category2.name : category1 === category2;
  }

  goBack(): void {
    this.router.navigate(['/admin-products']);
  }

  setFormatPrice(e: any): void {
    const newFormat = formatPrice(parseInt(e?.target?.value));
    this.productForm.controls['price'].setValue(newFormat);
  }

  setNumberFormat(e: any): void {
    const intValue = parsePriceToInteger(e?.target?.value);
    this.productForm.controls['price'].setValue(intValue);
  }
}
