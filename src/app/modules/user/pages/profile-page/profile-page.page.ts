import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserDto } from 'src/app/interfaces/user/user.interface';
import { maxDateValidator } from 'src/app/utils/validators/max-date.validator';
import { ToastController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonLabel,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonItem,
    IonImg,
    IonInput,
    FormsModule,
    ReactiveFormsModule,
    IonIcon,
    IonButton,
    CommonModule,
  ],
})
export default class UserProfilePage implements OnInit {
  userForm: FormGroup;
  imageSrc: string = 'assets/icon/user.svg';
  profileService = inject(ProfileService);
  currentUser: UserDto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      birthdate: ['', [Validators.required, this.validateBirthdate]],
    });
  }

  async ngOnInit() {
    const currentUser = await this.authService.getUserLoggued();

    this.currentUser = currentUser;
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid) {
      return;
    }

    // Obtener los valores del formulario
    const { name, phoneNumber, birthdate } = this.userForm.value;

    this.profileService.uploadImage(this.imageSrc, this.currentUser?.uid!);
  }

  async pickImage(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      promptLabelHeader: 'Seleccionar una opción',
      promptLabelPicture: 'Tomar una foto',
      promptLabelPhoto: 'Elegir de galería',
    });

    if (!image || !image.webPath) {
      return;
    }

    this.imageSrc = image.webPath;
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      // Redireccionar al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  validateBirthdate(control: any): { [key: string]: any } | null {
    const birthdate = new Date(control.value);
    const currentDate = new Date();

    if (birthdate > currentDate) {
      return { invalidBirthdate: true };
    }

    return null;
  }

  get isBirthdateInvalid(): boolean {
    return !!this.userForm.get('birthdate')?.invalid;
  }

  get isFormInvalid(): boolean {
    return this.userForm.invalid;
  }
}
