import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-reportescomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './reportescomponent.html',
  styleUrl: './reportescomponent.css',
})
export class Reportescomponent {}
