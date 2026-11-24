import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import {
  LucideBell,
  LucideCalendarDays,
  LucideChartColumn,
  LucideChartColumnStacked,
  LucideCircleUserRound,
  LucideClipboardList,
  LucideClock3,
  LucideFilePlus,
  LucideFileText,
  LucideHeartPulse,
  LucideHouse,
  LucideList,
  LucideLogOut,
  LucideNotebookPen,
  LucidePill,
  LucideSearch,
  LucideSend,
  LucideShieldCheck,
  LucideStethoscope,
  LucideTimer,
  LucideUsers,
} from '@lucide/angular';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-menucomponent',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    LucideBell,
    LucideCalendarDays,
    LucideChartColumn,
    LucideChartColumnStacked,
    LucideCircleUserRound,
    LucideClipboardList,
    LucideClock3,
    LucideFilePlus,
    LucideFileText,
    LucideHeartPulse,
    LucideHouse,
    LucideList,
    LucideLogOut,
    LucideNotebookPen,
    LucidePill,
    LucideSearch,
    LucideSend,
    LucideShieldCheck,
    LucideStethoscope,
    LucideTimer,
    LucideUsers,
  ],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {
  constructor(
    private readonly loginService: Loginservice,
    private readonly router: Router
  ) {}

  get username(): string {
    return this.loginService.getUsername();
  }

  get roles(): string {
    return this.loginService.getRoles().join(', ');
  }

  cerrarSesion(): void {
    this.loginService.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
