import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private fireBaseAuth = inject(Auth);

  constructor() {}

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.fireBaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, {
        displayName: username,
      })
    );

    return from(promise);
  }

  Login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(
      this.fireBaseAuth,
      email,
      password
    ).then((response) => {});

    return from(promise);
  }
}
