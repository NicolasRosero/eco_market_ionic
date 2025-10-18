import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '../types';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertCtrl: AlertController) { }

  // Alert para mostrar información
  async presentBasicAlert(options: AlertOptions): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: options.header,
      subHeader: options.subHeader,
      message: options.message,
      buttons: ['OK'],
      backdropDismiss: options.backdropDismiss ?? true,
      cssClass: options.cssClass
    });

    await alert.present();
  }

  // Alert para confirmar una acción
  presetConfirmActionAlert(
    options: AlertOptions,
    confimrText: string = 'Sí',
    cancelText: string = 'No'
  ): Observable<boolean> {
    return from(new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: options.header,
        subHeader: options.subHeader,
        message: options.message,
        backdropDismiss: options.backdropDismiss ?? true,
        cssClass: options.cssClass,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false)
            }
          },
          {
            text: confimrText,
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    }));
  }

  // Alert para le manejo de acciones propias (callbacks)
  async customActionsAlert(
    options: AlertOptions,
    confimrText: string = 'Sí',
    cancelText: string = 'No',
    confirmAction: () => void,
    cancelAction?: () => void
  ): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: options.header,
      subHeader: options.subHeader,
      message: options.message,
      backdropDismiss: options.backdropDismiss ?? true,
      cssClass: options.cssClass,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          handler: () => {
            cancelAction?.();
          }
        },
        {
          text: confimrText,
          handler: () => {
            confirmAction();
          }
        }
      ]
    });

    await alert.present();
  }
}
