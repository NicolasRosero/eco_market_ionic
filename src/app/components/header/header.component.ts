import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { appName } from 'src/app/utils/strings';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ IonicModule, CommonModule ]
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
    setTimeout(() => {
      this.getFullName();
      this.getNameInitials();
    }, 1000);
  }

  openMenu(): void {
    this.menuController.open('main-menu');
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  async getFullName(): Promise<void> {
    const name = await this.storageService.get('user_name');

    this.fullName = name;
  }

  async getNameInitials(): Promise<void> {
    const name: string = await this.storageService.get('user_name');
    const lastname: string[] = name.split(' ');
    const initalName = name.charAt(0).toUpperCase();
    const initalLastname = lastname[1].charAt(0).toUpperCase();

    this.initialsName = `${initalName}.${initalLastname}`;
  }
}
