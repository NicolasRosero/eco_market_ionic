import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { addIcons } from 'ionicons';
import { alertCircle, cartOutline, checkmarkCircle, closeCircle, locationOutline, menu, menuOutline, chevronDown, homeOutline, personOutline, gridOutline, listOutline, settingsOutline, logOutOutline, personCircleOutline, addOutline, removeOutline, trashOutline, bagOutline, pencilOutline } from 'ionicons/icons';

// Configurar aquí los iconos a usar
addIcons({
  'alert-circle': alertCircle,
  'checkmark-circle': checkmarkCircle,
  'close-circle': closeCircle,
  'menu-outline': menuOutline,
  'cart-outline': cartOutline,
  'location-outline': locationOutline,
  'menu': menu,
  'chevronDown': chevronDown,
  'home-outline': homeOutline,
  'person-outline': personOutline,
  'person-circle-outline': personCircleOutline,
  'grid-outline': gridOutline,
  'list-outline': listOutline,
  'settings-outline': settingsOutline,
  'log-out-outline': logOutOutline,
  'add-outline': addOutline,
  'remove-outline': removeOutline,
  'trash-outline': trashOutline,
  'bag-outline': bagOutline,
  'pencil-outline': pencilOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot()),
  ],
});
