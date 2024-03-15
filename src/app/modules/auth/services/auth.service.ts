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
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserDto } from 'src/app/interfaces/user/user.interface';

const PATH = 'users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireBaseAuth = inject(Auth);
  private _firestore = inject(Firestore);

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

  async getUserLoggued() {
    try {
      const user = await this.getCurrentUser();
      const userDocument = doc(this._firestore, PATH, user?.uid ?? '');
      const userSnapshot = await getDoc(userDocument);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserDto;
        return userData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  private getCurrentUser(): Promise<User | null> {
    return new Promise<User | null>((resolve) => {
      this.fireBaseAuth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  async updateUser(user: User): Promise<void> {
    try {
      await updateProfile(user, { displayName: user.displayName });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async signOut() {
    const user = await this.getCurrentUser();
    if (user) {
      return this.fireBaseAuth.signOut();
    }
    return Promise.reject('User not found');
  }
}
