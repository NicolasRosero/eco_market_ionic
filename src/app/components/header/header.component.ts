import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { appName } from 'src/app/utils/strings';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/types';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ IonicModule, CommonModule ]
})
export class HeaderComponent  implements OnInit {
  @Input() showProfile: boolean = true;
  appName: string = appName;
  currentUser: User | null = null;
  fullName: string | undefined = '';
  initialsName: string | undefined = '';

  constructor(
    private menuController: MenuController,
    private router: Router,
    private authService: AuthService
  ) {
    setTimeout(async () => {
      this.currentUser = await this.authService.getCurrentUser();

      this.getFullName();
      this.getNameInitials();
    }, 800);
  }

  ngOnInit() { }

  openMenu(): void {
    this.menuController.open('main-menu');
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  async getFullName(): Promise<void> {
    this.fullName = this.currentUser?.name;
  }

  async getNameInitials(): Promise<void> {
    const splitName: string[] | undefined = this.currentUser?.name?.split(' ');

    let initalName: string | undefined = '';
    let initalLastname: string | undefined = '';

    if (splitName && splitName.length > 0) {
      initalName = splitName[0]?.charAt(0).toUpperCase();
      initalLastname = splitName[1]?.charAt(0).toUpperCase() || '';
    }

    this.initialsName = `${initalName}.${initalLastname}`;
  }
}
