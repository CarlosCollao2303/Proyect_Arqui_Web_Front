import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-recetascomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './recetascomponent.html',
  styleUrl: './recetascomponent.css',
})
export class Recetascomponent {}
