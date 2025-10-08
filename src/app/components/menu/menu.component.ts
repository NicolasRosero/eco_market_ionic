import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from "@ionic/angular";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types';
import { appName } from 'src/app/utils/strings';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonicModule],
})
export class MenuComponent implements OnInit {
  appName: string = appName;
  currentUser: User | null = null;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private authService: AuthService
  ) {
    setTimeout(() => {
      this.getUserInfo();
    }, 800);
  }

  ngOnInit() { }

  async getUserInfo(): Promise<void> {
    this.currentUser = await this.authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.menuController.close('main-menu');
  }

  async navigateTo(place: string): Promise<void> {
    await this.menuController.close('main-menu');
    this.router.navigate([`/${place}`]);
  }
}
