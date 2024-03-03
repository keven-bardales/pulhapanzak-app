import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonFooter,
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
    ReactiveFormsModule,
    CommonModule,
  ],
  styleUrls: ['./login.page.scss'],
})
export default class LoginPage implements OnInit {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}
  screen = 'signin';
  formData = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit() {
    console.log('Login page loaded');
  }

  change(value: string) {
    this.screen = 'register';
  }

  login() {
    const { email, password } = this.formData.value;

    if (!email) {
      return;
    }

    if (!password) {
      return;
    }

    this.authService
      .Login(email, password)
      .pipe(take(1))
      .subscribe({
        next: (value) => {
          this.router.navigate(['/home']);
        },
        error: (err) => {},
      });
  }

  register() {}

  get name() {
    return this.formData.get('name');
  }
  get email() {
    return this.formData.get('email');
  }
  get password() {
    return this.formData.get('password');
  }
}
