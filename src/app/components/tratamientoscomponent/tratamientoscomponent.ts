import { Component } from '@angular/core';
import { Menucomponent } from '../menucomponent/menucomponent';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tratamientoscomponent',
  imports: [Menucomponent,RouterOutlet],
  templateUrl: './tratamientoscomponent.html',
  styleUrl: './tratamientoscomponent.css',
})
export class Tratamientoscomponent {}
