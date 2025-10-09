import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class HomePage {
  counter = [
    { value: 0, tag: 'Horas' },
    { value: 0, tag: 'Minutos' },
    { value: 0, tag: 'Segundos' },
  ];

  homeProducts = [
    { image: 'assets/images/product1.jpg', alt: 'producto 1' },
    { image: 'assets/images/product2.jpg', alt: 'producto 2' },
    { image: 'assets/images/product3.jpg', alt: 'producto 3' },
  ];

  private intervalId: any;

  ngOnInit() {
    this.actualizarHora();
    this.intervalId = setInterval(() => this.actualizarHora(), 1000);
  }

  private actualizarHora() {
    const now = new Date();
    this.counter = [
      { value: now.getHours(), tag: 'Horas' },
      { value: now.getMinutes(), tag: 'Minutos' },
      { value: now.getSeconds(), tag: 'Segundos' },
    ];
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
