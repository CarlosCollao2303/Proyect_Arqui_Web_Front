import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideBell,
  LucideCalendarDays,
  LucideCircleCheck,
  LucideCirclePlay,
  LucideClipboardList,
  LucideClock3,
  LucideFileText,
  LucideHeartPulse,
  LucideMapPin,
  LucideMenu,
  LucidePill,
  LucideShieldCheck,
  LucideStethoscope,
  LucideUserRound,
  LucideVideo,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-homecomponent',
  imports: [
    RouterLink,
    LucideArrowRight,
    LucideBell,
    LucideCalendarDays,
    LucideCircleCheck,
    LucideCirclePlay,
    LucideClipboardList,
    LucideClock3,
    LucideFileText,
    LucideHeartPulse,
    LucideMapPin,
    LucideMenu,
    LucidePill,
    LucideShieldCheck,
    LucideStethoscope,
    LucideUserRound,
    LucideVideo,
    LucideX,
  ],
  templateUrl: './homecomponent.html',
})
export class Homecomponent {
  menuAbierto = false;

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
