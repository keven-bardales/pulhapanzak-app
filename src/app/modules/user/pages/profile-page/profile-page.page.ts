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
import { ToastController } from '@ionic/angular';
import { maxDateValidator } from 'src/app/utils/validators/max-date.validator';
import { User } from 'firebase/auth';
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
  currentUser: UserDto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private toastController: ToastController
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
    this.currentUser = await this.authService.getUserLoggued();
    if (this.currentUser) {
      this.userForm.patchValue({
        name: this.currentUser.name,
        phoneNumber: this.currentUser.phoneNumber,
        birthdate: this?.currentUser?.birthdate!.toISOString().split('T')[0],
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid || !this.currentUser) {
      return;
    }

    const { name, phoneNumber, birthdate } = this.userForm.value;
    this.currentUser.name = name;
    this.currentUser.phoneNumber = phoneNumber;
    this.currentUser.birthdate = new Date(birthdate);

    try {
      const url = await this.profileService.uploadImage(
        this.imageSrc,
        this.currentUser.uid
      );
      if (url) {
        this.currentUser.imageProfile = url;
      }
      await this.saveUser();
      this.showAlert('Usuario actualizado correctamente');
    } catch (error) {
      this.showAlert('Ha ocurrido un error al actualizar el usuario', true);
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

    this.imageSrc = image.webPath ?? image.path ?? '';
  }

  async saveUser(): Promise<void> {
    try {
      if (!this.currentUser) return;

      if (this.currentUser != null) {
        await this.authService.updateUser(this.currentUser as any);
      }
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
      this.showAlert('Ha cerrado sesión correctamente');
    } catch (error) {
      this.showAlert('Ha ocurrido un error al cerrar sesión', true);
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

  validateBirthdate(control: any): { [key: string]: any } | null {
    const birthdate = new Date(control.value);
    const currentDate = new Date();

    if (birthdate > currentDate) {
      return { invalidBirthdate: true };
    }

    return null;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  get isBirthdateInvalid(): boolean {
    return !!this.userForm.get('birthdate')?.invalid;
  }

  get isFormInvalid(): boolean {
    return this.userForm.invalid;
  }

  get isNameInvalid(): boolean {
    return !!this.userForm.get('name')?.invalid;
  }

  get isPhoneNumberInvalid(): boolean {
    return !!this.userForm.get('phoneNumber')?.invalid;
  }
}
