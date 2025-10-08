import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthUserResp, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private USERS_KEY = 'users';

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  async register(user: User): Promise<AuthUserResp> {
    try {
      const users: User[] = JSON.parse(await this.storageService.get(this.USERS_KEY)) || [];

      const isRegistered = users.find((item) => item.email === user.email);

      if (isRegistered) {
        return {
          message: 'El usuario ya se encuentra registrado',
          state: false
        };
      }

      users.push(user);
      await this.storageService.set(this.USERS_KEY, JSON.stringify(users));
      return {
        message: 'Usuario registrado correctamente',
        state: true
      };
    } catch (error) {
      console.error('Ha ocurrido un error al registrar al usuario: ', error);
      return {
        message: 'Ha ocurrido un error.\nComunicate con el administrador.',
        state: false
      };
    }
  }

  async login(email: string, password: string): Promise<AuthUserResp> {
    try {
      const users: User[] = JSON.parse(await this.storageService.get(this.USERS_KEY)) || [];
      const user = users.find((item) => item.email === email && item.password === password);

      if (user) {
        this.currentUser = user;
        await this.storageService.set('current_user', JSON.stringify(user));
        await this.storageService.set('isLoggedIn', true);

        return {
          message: 'Bienvenido',
          state: true
        };
      }

      return {
        message: 'Lo sentimos, no hay usuarios registrados con estos datos.\nPor favor, regístrate para continuar.',
        state: false
      };
    } catch (error) {
      console.error('Ha ocurrido un error al iniciar sesión: ', error);
      return {
        message: 'Ha ocurrido un error.\nComunicate con el administrador.',
        state: false
      };
    }
  }

  async logout() {
    await this.storageService.set('isLoggedIn', false);

    this.storageService.set('current_user', null);
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.currentUser) {
        this.currentUser = JSON.parse(await this.storageService.get('current_user')) || null;
      }

      return this.currentUser;
    } catch (error) {
      console.log('Ha ocurrido un error al consultar el usuario en sesión: ', error);
      return null;
    }
  }

  async editUser(user: User): Promise<AuthUserResp> {
    try {
      const users: User[] = JSON.parse(await this.storageService.get(this.USERS_KEY)) || [];

      const userIndex = users.findIndex((item) => item.email === user.email);

      if (userIndex !== -1) {
        users[userIndex] = user;

        // Actualizar el registro
        await this.storageService.set(this.USERS_KEY, JSON.stringify(users));

        // Actualizar el usuario en sesión
        this.currentUser = user;
        await this.storageService.set('current_user', JSON.stringify(user));

        return {
          message: '¡Perfil actualizado!',
          state: true
        }
      }

      return {
        message: 'No se logro editar el usuario.\nComunicate con el administrador',
        state: false
      }
    } catch (error) {
      console.error('Ha ocurrido un error al editar el usuario: ', error);
      return {
        message: 'Ha ocurrido un error.\nComunicate con el administrador.',
        state: false
      };
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users: User[] = JSON.parse(await this.storageService.get(this.USERS_KEY)) || [];
      const user = users.find((item) => item.email === email);

      if (user) {
        this.currentUser = user;
        await this.storageService.set('current_user', JSON.stringify(user));
        await this.storageService.set('isLoggedIn', true);

        return user
      }

      return null;
    } catch (error) {
      console.error('Ha ocurrido un error al consultar por email: ', error);
      return null;
    }
  }
}
