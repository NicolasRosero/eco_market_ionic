import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

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
    private storageService: StorageService,
    private toastService: ToastService
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
      try {
        const email = this.loginForm.controls['email'].value;
        const password = this.loginForm.controls['password'].value;
        const emailSaved: string = await this.storageService.get('user_email');
        const passwordSaved: string = await this.storageService.get('user_password');

        if(!emailSaved && !passwordSaved) {
          this.toastService.presentToast(
            "Lo sentimos, no hay usuarios registrados con estos datos.\nPor favor, regístrate para continuar.",
            5000,
            "top",
            "warning",
            "alert-circle"
          );

          return;
        }

        if ((email === emailSaved) && (password === passwordSaved)) {
          this.toastService.presentToast(
            "Bienvenido",
            2000,
            'bottom',
            'success',
            'checkmark-circle'
          );

          this.router.navigate(['/home']);
          this.storageService.set('isLoggedIn', true);
          this.resetForm();
        } else {
          this.toastService.presentToast(
            "Usuario o contrasña incorrectos",
            2000,
            "bottom",
            "danger",
            "close-circle"
          );
        }
      } catch (error) {
        console.error('Ha ocurrido un error al obtener la información');
        this.toastService.presentToast(
          "Ha ocurrido un error.\nReportalo al administrador.",
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
