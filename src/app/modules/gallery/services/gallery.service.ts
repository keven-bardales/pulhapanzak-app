import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CharacterResponse } from '../models/character.response.interface';
import { Character } from '../models/character.interface';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Post } from '../models/post.interface';
import { Observable, catchError, of, tap } from 'rxjs';
import { ToastController } from '@ionic/angular';

const PATH = 'galleries';
const API = 'https://rickandmortyapi.com/api/';
const JsonAPI = 'https://jsonplaceholder.typicode.com/';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private _firestore = inject(Firestore);
  private _http = inject(HttpClient);
  private toastController = inject(ToastController);
  private _collection = collection(this._firestore, PATH);

  async getGalleries(userId: string): Promise<any[]> {
    try {
      const galleriesQuery = query(
        this._collection,
        where('userId', '==', userId)
      );
      const galleriesSnapshot = await getDocs(galleriesQuery);
      const galleries: any[] = [];
      galleriesSnapshot.forEach((doc) => {
        galleries.push({ id: doc.id, ...doc.data() });
      });
      return galleries;
    } catch (error) {
      console.error('Error al obtener las galerías:', error);
      throw error;
    }
  }

  getCharacters() {
    return this._http.get<CharacterResponse>(`${API}character`).pipe(
      tap((result) => result),
      catchError(
        this.handleError<CharacterResponse>(
          'Ha ocurrido un error al obtener la información',
          {} as CharacterResponse
        )
      )
    );
  }

  getCharacterById(id: number) {
    return this._http.get<Character>(`${API}character/${id}`).pipe(
      tap((result) => result),
      catchError(
        this.handleError<Character>(
          'Ha ocurrido un error al obtener la información',
          {} as Character
        )
      )
    );
  }

  createPost(post: Post) {
    return this._http.post<any>(`${JsonAPI}posts`, post).pipe(
      tap((newPost: Post) =>
        this.showAlert(`Post ${newPost.title} creado correctamente`)
      ),
      catchError(
        this.handleError<Post>('Ha ocurrido un error al crear un nuevo post')
      )
    );
  }

  updatePost(post: Post) {
    return this._http.put<Post>(`${JsonAPI}posts/${post.id}`, post).pipe(
      tap((model: Post) =>
        this.showAlert(`Post ${model.title} actualizado correctamente`)
      ),
      catchError(
        this.handleError<Post>('Ha ocurrido un error al actualizar el post')
      )
    );
  }

  deletePost(id: number) {
    return this._http.delete<Post>(`${JsonAPI}posts/${id}`).pipe(
      tap((_) => this.showAlert('Post eliminado correctamente')),
      catchError(
        this.handleError<Post>('Ha ocurrido un error al eliminar el post')
      )
    );
  }

  private handleError<T>(message: string, result?: T) {
    return (): Observable<T> => {
      this.showAlert(`${message}, vuelva a intentarlo más tarde.`, true);
      return of(result as T);
    };
  }

  async showAlert(message: string, error: boolean = false): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: error ? 'danger' : 'success',
    });
    await toast.present();
  }
}
