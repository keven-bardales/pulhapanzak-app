import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from '@angular/fire/storage';

const PATH = 'users';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _storage: Storage = inject(Storage);

  async uploadImage(imageSrc: string, userId: string): Promise<string | null> {
    try {
      const url = `${PATH}/${userId}.jpg`;
      const storageRef = ref(this._storage, url);

      const existingFile = await getDownloadURL(storageRef).catch(() => null);
      if (existingFile) {
        await deleteObject(ref(this._storage, existingFile));
      }

      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  }
}
