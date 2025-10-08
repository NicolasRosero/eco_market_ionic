import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonLabel, IonButton, CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginPage implements OnInit {
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?])[A-Za-z\d@$!%*?&]{8,}$/g;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.loginForm = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(this.passwordRegex)]]
    });
  }

  ngOnInit() { }

  validateForm(): boolean {
    if (this.loginForm.controls['email'].invalid) {
      this.loginForm.controls['email'].markAsDirty();
      this.toastService.presentToast(
        "Debes ingresar un correo valido para continuar",
        3000,
        'bottom',
        'warning',
        'alert-circle'
      );

      return false;
    }

    if (this.loginForm.controls['password'].invalid) {
      this.loginForm.controls['password'].markAsDirty();
      this.toastService.presentToast(
        "La contraseña es obligatoria y se recomienda cumplir con la estructura de ejemplo",
        3000,
        'bottom',
        'warning',
        'alert-circle'
      );

      return false;
    }

    return true;
  }

  async login(): Promise<void> {
    const result = this.validateForm();

    if (result) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;

      const resp = await this.authService.login(email, password);

      if (resp.state) {
        this.toastService.presentToast(
          resp.message,
          2000,
          'bottom',
          'success',
          'checkmark-circle'
        );

        this.router.navigate(['/home']);
        this.resetForm();
      } else {
        this.toastService.presentToast(
          resp.message,
          2000,
          "bottom",
          "danger",
          "close-circle"
        );
      }
    }
  }

  resetForm(): void {
    this.loginForm.reset();
    this.loginForm.clearValidators();
  }

  goToRegister(): void {
    this.resetForm();
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.resetForm();
    this.router.navigate(['/forgot-password']);
  }
}
