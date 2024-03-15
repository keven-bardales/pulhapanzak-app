import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.fireBaseAuth,
      email,
      password
    ).then((response) => {});

    return from(promise);
  }

  forgotPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.fireBaseAuth, email);
    return from(promise);
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.fireBaseAuth.onAuthStateChanged((user) => {
        observer.next(!!user);
      });
    });
  }

  async getUserLogged(): Promise<User | null> {
    try {
      const userCredential = await this.fireBaseAuth.currentUser;
      return userCredential ? userCredential : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await updateProfile(user, { displayName: user.displayName });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
}
