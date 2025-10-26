import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from "src/app/components/header/header.component";

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.page.html',
  styleUrls: ['./create-update-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class CreateUpdateProductPage implements OnInit {

productForm: FormGroup

  constructor( 
    
    private formBuilder: FormBuilder,

  ) {
    this.productForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      Precio: [null, [Validators.required]],
      category: ['', Validators.required],
      stock: ['', [Validators.required]],
      noted: ['', Validators.required],
      agreeTerms: [false]
    });
   }

  ngOnInit() { }
}
