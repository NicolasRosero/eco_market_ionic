import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonButton, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { IonicModule, MenuController } from '@ionic/angular';
import { appName } from 'src/app/utils/strings';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonButton, IonToolbar, IonIcon, IonicModule]
})
export class HeaderComponent  implements OnInit {
  @Input() showProfile: boolean = true;
  appName: string = appName;
  fullName: string = '';
  initialsName: string = '';

  constructor(
    private menuController: MenuController,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.getFullName();
  }

  openMenu(): void {
    this.menuController.open('main-menu');
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  async getFullName(): Promise<void> {
    const name = await this.storageService.get('user_name');
    const lastname = await this.storageService.get('user_lastname');

    this.fullName = `${name} ${lastname}`;
  }

  async getNameInitials(): Promise<void> {
    const name: string = await this.storageService.get('user_name');
    const lastname: string = await this.storageService.get('user_lastname');
    const initalName = name.charAt(0).toUpperCase();
    const initalLastname = lastname.charAt(0).toUpperCase();

    this.initialsName = `${initalName}.${initalLastname}`;
  }
}
