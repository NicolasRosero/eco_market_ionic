import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonLabel, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit, OnDestroy {
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  private generalTimer: any | undefined;

  registerForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.registerForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false]
    });
  }

  ngOnInit(): void {}

  validForm(): boolean {
    if(this.registerForm.controls['email'].invalid) {
      this.toastService.presentToast(
        "El correo es obligatorio y debe ser un correo valido",
        3000,
        'bottom',
        'danger',
        'close-circle'
      );

      return false;
    }

    // Validación de la contraseña
    if(this.registerForm.controls['password'].invalid) {
      this.registerForm.controls['password'].markAsDirty();
      this.toastService.presentToast(
        "La contraseña es obligatoria y debe complir con la estrucutra de ejemplo",
        3000,
        'bottom',
        'danger',
        'close-circle'
      );

      return false;
    }

    // Validación de confirmación de las contraseñas
    if(this.registerForm.controls['password'].value !== this.registerForm.controls['confirmPassword'].value) {
      this.toastService.presentToast(
        "Las contraseñas no coinciden",
        3000,
        'bottom',
        'danger',
        'close-circle'
      );

      return false;
    }

    // Validación de la aceptación de términos y condiciones
    if(!this.registerForm.controls['agreeTerms'].value) {
      this.toastService.presentToast(
       "Debes aceptar los terminos y condiciones para continuar",
        3000,
        'bottom',
        'warning',
        'alert-circle'
      );

      return false;
    }

    // Validación general
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsDirty();
      return false;
    }

    return true;
  }

  submit(): void {
    const isValid = this.validForm();

    if(isValid) {
      this.saveRegisterData();

      this.toastService.presentToast(
        "¡Bienvenido!",
        3000,
        "bottom",
        "success"
      );

      this.generalTimer = setTimeout(() => {
        this.resetForm();
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  saveRegisterData(): void {
    try {
      this.storageService.set("user_name", this.registerForm.controls['name'].value);
      this.storageService.set("user_email", this.registerForm.controls['email'].value);
      this.storageService.set("user_phone", this.registerForm.controls['phone'].value);
      this.storageService.set("user_password", this.registerForm.controls['password'].value);
      this.storageService.set("user_agreeTerms", this.registerForm.controls['agreeTerms'].value);
    } catch (error) {
      console.error('Ha ocurrido un error al guardar la información');
      this.toastService.presentToast(
        "Ha ocurrido un error \n Reportalo al administrador",
        2000,
        "bottom",
        "danger",
        "close-circle"
      );
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.resetForm();
  }

  resetForm(): void {
    this.registerForm.reset();
    this.registerForm.clearValidators();
  }

  ngOnDestroy(): void {
    if (this.generalTimer) {
      clearTimeout(this.generalTimer);
    }
  }
}
