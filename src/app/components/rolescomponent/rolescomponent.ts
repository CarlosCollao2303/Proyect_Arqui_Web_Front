import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-rolescomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './rolescomponent.html',
  styleUrl: './rolescomponent.css',
})
export class Rolescomponent {}
