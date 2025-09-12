import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { toastColor, toastPosition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private toastController: ToastController
  ) {}

  async presentToast(
    message: string,
    duration = 2000,
    position: toastPosition = 'bottom',
    color: toastColor = 'primary',
    icon?: string
  ): Promise<void> {
    const toast = this.toastController.create({
      message,
      duration,
      position,
      color,
      icon
    });

    (await toast).present();
  }
}
