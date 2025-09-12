import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    // Inicializar el almacenamiento local
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  // Método para guardar un valor
  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Método para obtener un valor
  public async get(key: string): Promise<any> {
    const value = await this._storage?.get(key);
    return value;
  }

  // Método para eliminar un valor
  public async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // Método para limpiar todo el almacenamiento
  public async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
