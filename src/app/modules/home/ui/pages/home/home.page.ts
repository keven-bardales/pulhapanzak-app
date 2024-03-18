import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HomeService } from '../../../services/home.service';
import { UserDto } from 'src/app/interfaces/user/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);
  private homeService = inject(HomeService);
  private toastController = inject(ToastController);
  user: UserDto | null = null;
  welcome: string = '';

  async getCurrentPosition(): Promise<void> {
    await this.homeService
      .getCurrentPosition()
      .then((position) => {
        console.log('Current position:', position);
        this.showAlert(
          `Su posición ha sido obtenida con éxito (Latitud: ${position?.coords?.latitude} / Longitud: ${position?.coords?.longitude})`
        );
      })
      .catch(() => {
        this.showAlert('Ha ocurrido un error, vuelva a intentarlo', true);
      });
  }

  ngOnInit(): void {
    this.authService.getUserLoggued().then((user) => {
      this.user = user;
      this.welcome = `Bienvenido(a) ${user?.name ?? ''}`;
    });
    this.getCurrentPosition();
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
}
