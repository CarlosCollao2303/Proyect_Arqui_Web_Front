import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-diagnosticoscomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './diagnosticoscomponent.html',
  styleUrl: './diagnosticoscomponent.css',
})
export class Diagnosticoscomponent {}
