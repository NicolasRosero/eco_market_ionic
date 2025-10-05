import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonLabel, IonInput, IonButton, CommonModule, ReactiveFormsModule]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });
  }

  ngOnInit() {
    this.profileForm.disable();

    setTimeout(() => {
      this.getInfoUser();
    }, 1000);
  }

  async getInfoUser(): Promise<void> {
    this.profileForm.controls['name'].setValue(await this.storageService.get('user_name'));
    this.profileForm.controls['email'].setValue(await this.storageService.get('user_email'));
    this.profileForm.controls['phone'].setValue(await this.storageService.get('user_phone'));
  }

  validForm(): boolean {
    if(this.profileForm.controls['email'].invalid) {
      this.toastService.presentToast(
        "El correo es obligatorio y debe ser un correo valido",
        3000,
        'bottom',
        'danger',
        'close-circle'
      );

      return false;
    }

    // Validación general
    if(this.profileForm.invalid) {
      this.profileForm.markAllAsDirty();
      return false;
    }

    return true;
  }

  saveData(): void {
    try {
      this.storageService.set("user_name", this.profileForm.controls['name'].value);
      this.storageService.set("user_email", this.profileForm.controls['email'].value);
      this.storageService.set("user_phone", this.profileForm.controls['phone'].value);
    } catch (error) {
      console.error('Ha ocurrido un error al guardar la información');

      this.toastService.presentToast(
        "Ha ocurrido un error. \n Reportalo al administrador.",
        2000,
        "bottom",
        "danger",
        "close-circle"
      );
    }
  }

  submit(): void {
    if(this.validForm()) {
      this.saveData();
      this.setEditingMode();
      this.resetForm();

      this.toastService.presentToast(
        "¡Perfil actualizado!",
        2000,
        "bottom",
        "success",
        "checkmark-circle"
      );
    }
  }

  resetForm(): void {
    this.profileForm.clearValidators();
  }

  setEditingMode(): void {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.profileForm.enable() : this.profileForm.disable();
  }
}
