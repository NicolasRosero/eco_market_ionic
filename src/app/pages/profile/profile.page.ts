import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthUserResp, User } from 'src/app/types';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "src/app/components/header/header.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      rol: ['']
    });
  }

  ngOnInit() {
    this.profileForm.disable();

    setTimeout(() => {
      this.getInfoUser();
    }, 1000);
  }

  async getInfoUser(): Promise<void> {
    this.currentUser = await this.authService.getCurrentUser();

    this.profileForm.controls['name'].setValue(this.currentUser?.name);
    this.profileForm.controls['email'].setValue(this.currentUser?.email);
    this.profileForm.controls['phone'].setValue(this.currentUser?.phone);
    this.profileForm.controls['rol'].setValue(this.currentUser?.rol);
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

  async saveData(): Promise<AuthUserResp> {
    const userDataTosave: User = {
      name: this.profileForm.controls['name'].value,
      email: this.profileForm.controls['email'].value,
      phone: this.profileForm.controls['phone'].value,
      password: this.currentUser?.password ?? '',
      rol: this.profileForm.controls['rol'].value,
      userAgreeTerms: true
    };

    return await this.authService.editUser(userDataTosave);
  }

  async submit(): Promise<void> {
    if(this.validForm()) {
      const resp = await this.saveData();

      if (resp.state) {
        this.setEditingMode();
        this.resetForm();

        this.toastService.presentToast(
          resp.message,
          2000,
          "bottom",
          "success",
          "checkmark-circle"
        );
      } else {
        this.setEditingMode();
        this.resetForm();

        this.toastService.presentToast(
          resp.message,
          2000,
          'bottom',
          'danger',
          'close-circle'
        );
      }
    }
  }

  resetForm(): void {
    this.profileForm.clearValidators();
  }

  setEditingMode(): void {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.profileForm.enable() : this.profileForm.disable();
    this.profileForm.controls['rol'].disable();
    this.profileForm.controls['email'].disable();
  }
}
