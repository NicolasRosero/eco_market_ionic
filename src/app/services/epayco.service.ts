import { Injectable } from "@angular/core";
import { EpaycoCheckoutData, ExportDataIVA } from "../types";

@Injectable({
  providedIn: 'root'
})
export class EpaycoService {
  private P_KEY = '199370e1a90ef799b38bd5a0c4906183';
  private TEST_MODE = true;
  private URL_CHECKOUT = 'https://checkout.epayco.co/checkout.js';

  constructor() { }

  initializedEpaycoCheckout(checkoutData: EpaycoCheckoutData): void {
    if (!(window as any).ePayco) {
      this.loadEpaycoCheckout()
        .then(() => {
          this.openCheckout(checkoutData);
        })
        .catch((error) => {
          console.error('Ha ocurrido un error al cargar el checkout de ePayco');
        });
    } else {
      this.openCheckout(checkoutData);
    }
  }

  // Función para cargar el archivo de checout de ePayco
  private loadEpaycoCheckout(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${this.URL_CHECKOUT}"]`);

      if (existingScript) {
        return resolve();
      }

      const script = document.createElement('script');
      script.src = this.URL_CHECKOUT;
      script.type = 'text/javascript';

      script.onload = () => {
        console.log('Script de ePayco cargado con éxito');
        return resolve();
      };

      script.onerror = () => {
        console.error('Ha ocurrido un error al cargar el script de ePayco');
        return reject(new Error('Ha ocurrido un error al cargar el script de ePayco'));
      };

      document.body.append(script);

    });
  }

  private openCheckout(checkoutData: EpaycoCheckoutData): void {
    try {
      console.log('Es modo test: ', this.TEST_MODE);

      const configHandlers = (window as any).ePayco.checkout.configure({
        key: this.P_KEY,
        test: this.TEST_MODE,
      });

      configHandlers.open(checkoutData);
    } catch (error) {
      console.error('Ha ocurrido un error al abrir el checkout de ePayco');
    }
  }

  // Función para generar un número de factura
  generateReceiptNum(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return `FAC-${timestamp}-${random}`;
  }

  // Calcular iva (solo para Colombia)
  calculateTaxes(subtotal: number): ExportDataIVA {
    const IVA_PORCENTAJE = 0.19;
    const base = subtotal / (1 + IVA_PORCENTAJE);
    const IVA = subtotal - base;

    return {
      base: Math.round(base * 100) / 100,
      iva: Math.round(IVA * 100) / 100,
      total: subtotal
    }
  }

  isTestMode(): boolean {
    return this.TEST_MODE;
  }

  setTestMode(newValue: boolean): void {
    this.TEST_MODE = newValue;
  }
}
