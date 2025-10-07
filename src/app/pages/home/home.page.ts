import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "src/app/components/header/header.component";
import { MenuComponent } from "src/app/components/menu/menu.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, MenuComponent],
})


export class HomePage {
  counter = [
    { value: 0, tag: 'Horas' },
    { value: 0, tag: 'Minutos' },
    { value: 0, tag: 'Segundos' },
  ];

  private intervalId: any;

  constructor() {}

  ngOnInit() {
    this.actualizarHora();
    this.intervalId = setInterval(() => this.actualizarHora(), 1000);
  }

  private actualizarHora() {
    const currentDate = new Date();

    this.counter = [
      { value: currentDate.getHours(), tag: 'Horas' },
      { value: currentDate.getMinutes(), tag: 'Minutos' },
      { value: currentDate.getSeconds(), tag: 'Segundos' },
    ];
  }

  homeProducts = [
    { image: 'assets/images/product1.jpg', alt: 'producto 1' },
    { image: 'assets/images/product2.jpg', alt: 'producto 2' },
    { image: 'assets/images/product3.jpg', alt: 'producto 3' },
  ];

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
