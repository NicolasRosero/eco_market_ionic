import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonLabel, IonButton, CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  private generalTimer: any | undefined;

  forgotPasswordForm: FormGroup;
  user: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  validForm(): boolean {
    if (this.forgotPasswordForm.controls['email'].invalid) {
      this.forgotPasswordForm.controls['email'].markAllAsDirty();
      this.toastService.presentToast(
        "El correo es obligatorio y debe ser un correo valido",
        3000,
        'bottom',
        'danger',
        'close-circle'
      );

      return false;
    }

    return true;
  }

  async submit(): Promise<void> {
    const isValid = this.validForm();

    if (isValid) {
      const email: string = this.forgotPasswordForm.controls['email'].value;

      this.user = await this.authService.getUserByEmail(email);

      const emailSaved: string | undefined = this.user?.email;

      if (email === emailSaved) {
        this.toastService.presentToast(
          "📧 Correo de recuperación enviado correctamente 📧",
          3000,
          'bottom',
          'success',
          'checkmark-circle'
        );

        this.generalTimer = setTimeout(() => {
          this.goToLogin();
          this.resetForm();
        }, 1500);
      } else {
        this.toastService.presentToast(
          "El correo ingresado al no se encuentra registrado en nuestro sistema.\nValida el correo o regístrate.",
          3000,
          'bottom',
          'danger',
          'close-circle'
        );
      }
    }
  }

  resetForm(): void {
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.clearValidators();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.generalTimer) {
      clearTimeout(this.generalTimer);
    }
  }
}
