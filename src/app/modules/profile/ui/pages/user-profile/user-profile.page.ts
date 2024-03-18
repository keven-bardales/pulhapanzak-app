import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonItem,
  IonDatetime,
  IonToast,
  ToastController,
  IonImg,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { maxDateValidator } from 'src/app/utils/validators/max-date.validator';
import { ProfileService } from '../../../services/profile.service';
import { UserDto } from 'src/app/interfaces/user/user.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    CommonModule,
    IonButton,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonImg,
    IonItem,
    IonLabel,
    IonTitle,
    IonToast,
    IonToolbar,
    ReactiveFormsModule,
  ],
})
export class UserProfilePage implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  imageSrc: string = 'assets/icon/user.svg';
  user: UserDto | null = null;
  userForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    birthdate: ['', [Validators.required, maxDateValidator(new Date())]],
    imageProfile: [''],
    phoneNumber: ['', Validators.required],
  });

  get isBirthdateInvalid(): boolean {
    const control = this.userForm.get('birthdate');
    return control ? control.hasError('invalidDate') : false;
  }

  get isFormInvalid(): boolean {
    return this.userForm.invalid;
  }

  getUserLoggued(): void {
    this.authService.getUserLoggued().then((user) => {
      this.user = user;
      this.imageSrc = user?.imageProfile ?? this.imageSrc;
      this.userForm.patchValue({
        name: user?.name,
        phoneNumber: user?.phoneNumber,
        imageProfile: user?.imageProfile,
        birthdate: user?.birthdate,
      });
    });
  }

  ngOnInit(): void {
    this.getUserLoggued();
  }

  onSubmit(): void {
    if (!this.isFormInvalid && this.user) {
      this.user.name = this.userForm?.get('name')?.value;
      this.user.phoneNumber = this.userForm?.get('phoneNumber')?.value;
      this.user.birthdate = this.userForm?.get('birthdate')?.value as Date;
      this.profileService
        .uploadImage(this.imageSrc, this.user?.uid ?? '')
        .then((url) => {
          if (url) {
            if (this.user) this.user.imageProfile = url;
          }
          this.saveUser();
        })
        .catch(() => {
          this.showAlert(
            'Ha ocurrido un error al cambiar su imagen de perfil, vuelva a intentarlo',
            true
          );
        });
    }
  }

  async pickImage() {
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

    this.imageSrc = image.webPath ?? image.path ?? '';
  }

  saveUser(): void {
    if (this.user) {
      this.authService
        .updateUser(this.user)
        .then(() => {
          this.getUserLoggued();
          this.showAlert('Usuario actualizado correctamente');
        })
        .catch(() => {
          this.showAlert('Ha ocurrido un error, vuelva a intentarlo', true);
        });
    }
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

  signOut(): void {
    this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
        this.showAlert('Ha cerrado sesión correctamente');
      })
      .catch(() => {
        this.showAlert('Ha ocurrido un error, vuelva a intentarlo', true);
      });
  }
}
