import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export default class HomePage implements OnInit {
  router = inject(Router);

  constructor() {}

  ngOnInit() {
    console.log('Home Page');
  }

  goToProfile() {
    this.router.navigate(['profile-page']);
  }
}
