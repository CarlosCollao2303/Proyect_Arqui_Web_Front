import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-especialidadescomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './especialidadescomponent.html',
  styleUrl: './especialidadescomponent.css',
})
export class Especialidadescomponent {}
