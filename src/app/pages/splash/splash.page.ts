import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class SplashPage implements OnInit {
  private splashTimer: any | undefined;
  private isLoggedIn = false;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.splashTimer = setTimeout(async () => {
      await this.validSession();

      if (this.isLoggedIn) {
        this.goToHome();
        return;
      }

      this.goToLogin();
    }, 2500);
  }

  private async validSession() {
    this.isLoggedIn = await this.storageService.get('isLoggedIn');
  }

  private goToHome(): void {
    this.router.navigate(['/home']);
  }

  private goToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.splashTimer) {
      clearTimeout(this.splashTimer);
    }
  }
}
