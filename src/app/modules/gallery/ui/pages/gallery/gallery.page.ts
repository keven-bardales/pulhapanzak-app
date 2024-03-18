import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { Character } from '../../../models/character.interface';
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
  ],
})
export class GalleryPage implements OnInit {
  private _galleryService = inject(GalleryService);
  characters: Character[] = [];
  character: Character = {} as Character;
  isModalOpen = false;

  createPost(): void {
    const post = {
      id: 0,
      userId: 1,
      title: 'Canopy de Pulhapanzak',
      body: 'En las cataratas de Pulhapanzak se pueden disfrutar esta cascada realizando el canopy de Pulhapanzak, una aventura única en Honduras.',
    };
    this._galleryService.createPost(post).subscribe();
  }

  loadCharacters(): void {
    this._galleryService.getCharacters().subscribe((characters) => {
      this.characters = characters.results as Character[];
    });
  }

  ngOnInit(): void {
    this.loadCharacters();
  }

  setOpen(isOpen: boolean, id: number = 0): void {
    this.isModalOpen = isOpen;
    if (id > 0)
      this._galleryService.getCharacterById(id).subscribe((character) => {
        this.character = character;
      });
    else this.character = {} as Character;
  }
}
