import { Component } from '@angular/core';
import { Menucomponent } from '../menucomponent/menucomponent';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-citascomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './citascomponent.html',
  styleUrl: './citascomponent.css',
})
export class Citascomponent {}
