import { Component } from '@angular/core';
import { Menucomponent } from '../menucomponent/menucomponent';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-historiasclinicascomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './historiasclinicascomponent.html',
  styleUrl: './historiasclinicascomponent.css',
})
export class Historiasclinicascomponent {}
