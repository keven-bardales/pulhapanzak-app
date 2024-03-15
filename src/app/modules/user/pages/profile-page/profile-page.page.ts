import { Component, OnInit } from '@angular/core';
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
  user: UserDto | null = null;
  userForm: FormGroup;
  imageSrc: string = ''; // Variable para almacenar la URL de la imagen de perfil

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      birthdate: ['', [Validators.required, maxDateValidator(new Date())]],
      phoneNumber: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getUserLogged();
  }

  async getUserLogged(): Promise<void> {
    try {
      this.user = (await this.authService.getUserLogged()) as any;
      if (this.user) {
        this.userForm.patchValue({
          name: this.user.name,
          phoneNumber: this.user.phoneNumber,
          birthdate: this.user.birthdate,
        });
        this.imageSrc = this.user.imageProfile || ''; // Establecer la URL de la imagen de perfil si está disponible
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid || !this.user) {
      return;
    }

    this.user.name = this.userForm.get('name')?.value;
    this.user.phoneNumber = this.userForm.get('phoneNumber')?.value;
    this.user.birthdate = this.userForm.get('birthdate')?.value as Date;

    try {
      const url = await this.profileService.uploadImage(
        this.imageSrc,
        this.user.uid
      );
      if (url) {
        this.user.imageProfile = url;
      }
      await this.authService.updateUser(this.user as any);
      await this.getUserLogged();
      this.showToast('Usuario actualizado correctamente');
    } catch (error) {
      this.showToast('Ha ocurrido un error al actualizar el usuario', true);
    }
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

    if (!image) return;

    this.imageSrc = image.webPath || image.path || '';
  }

  async showToast(message: string, isError: boolean = false): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: isError ? 'danger' : 'success',
    });
    await toast.present();
  }

  signOut(): void {
    this.router.navigate(['/login']);
  }

  get isFormInvalid(): boolean {
    return this.userForm.invalid;
  }

  get isBirthdateInvalid(): boolean {
    return !!(
      this.userForm.get('birthdate')?.invalid &&
      this.userForm.get('birthdate')?.touched
    );
  }
}
