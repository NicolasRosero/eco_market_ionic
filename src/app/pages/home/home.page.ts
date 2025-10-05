import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})


export class HomePage {
  
  contador = [
    { valor: 0, etiqueta: 'Horas' },
    { valor: 0, etiqueta: 'Minutos' },
    { valor: 0, etiqueta: 'Segundos' },
  ];

  private intervalId: any;

  ngOnInit() {
    this.actualizarHora(); // Iniciar la hora 
    this.intervalId = setInterval(() => this.actualizarHora(), 1000); // Actualiza cada segundo
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Limpiar intervalo del componente 
  }

  private actualizarHora() {
    const ahora = new Date();
    this.contador = [
      { valor: ahora.getHours(), etiqueta: 'Horas' },
      { valor: ahora.getMinutes(), etiqueta: 'Minutos' },
      { valor: ahora.getSeconds(), etiqueta: 'Segundos' },
    ];
  }

  productos = [
    { imagen: '../../../assets/images/product1.jpg', alt: 'producto 1' },
    { imagen: '../../../assets/images/product2.jpg', alt: 'producto 2' },
    { imagen: '../../../assets/images/product3.jpg', alt: 'producto 3' },
  ];

  constructor() {}
}
