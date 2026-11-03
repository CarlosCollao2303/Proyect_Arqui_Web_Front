import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-examenescomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './examenescomponent.html',
  styleUrl: './examenescomponent.css',
})
export class Examenescomponent {}
