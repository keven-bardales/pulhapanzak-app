import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar correctamente tu servicio AuthService
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonToast,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonInput,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonLabel,
    IonToast,
  ],
})
export class RegistroComponent implements OnInit {
  formData: FormGroup = new FormGroup({});
  isToastOpen: boolean = false;
  toastMessage: string = '';
  alertColor: string = 'green';

  router = inject(Router);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.formData = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  register() {
    if (this.formData.invalid) {
      return; // Si el formulario es inválido, no se registra al usuario
    }

    const { username, email, password } = this.formData.value;

    // Llama al método de registro del servicio AuthService pasando los datos del formulario
    this.authService.register(email, username, password).subscribe({
      next: (response) => {
        // Maneja la respuesta del servicio después del registro exitoso

        this.setOpenToast(true, 'Registro exitoso', 'green');

        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Maneja el error en caso de que falle el registro
        console.error('Error en el registro', error);
        this.setOpenToast(true, error.message, 'red');
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      },
    });
  }

  setOpenToast(value: boolean, message: string, alertColor: string) {
    this.isToastOpen = value;
    this.toastMessage = message;
    this.alertColor = alertColor;

    setTimeout(() => {
      this.toastMessage = '';
    }, 5000);
  }

  // Getters para acceder fácilmente a los campos del formulario
  get username() {
    return this.formData.get('username');
  }

  get email() {
    return this.formData.get('email');
  }

  get password() {
    return this.formData.get('password');
  }
}
