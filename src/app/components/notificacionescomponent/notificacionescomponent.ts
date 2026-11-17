import { Component } from '@angular/core';
import { Menucomponent } from '../menucomponent/menucomponent';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-notificacionescomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './notificacionescomponent.html',
  styleUrl: './notificacionescomponent.css',
})
export class Notificacionescomponent { }
