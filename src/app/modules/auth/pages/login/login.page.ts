import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

  constructor() {}
  screen = 'signin';
  formData = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  ngOnInit() {
    console.log('Login page loaded');
  }

  change(value: string) {
    this.screen = 'register';
  }

  login() {}

  register() {}
}
