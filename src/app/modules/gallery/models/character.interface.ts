import { CharacterLocation } from './character-location.interface';

export interface Character {
  id: number;
  name: string;
  species: string;
  gender: string;
  image: string;
  location: CharacterLocation;
}
