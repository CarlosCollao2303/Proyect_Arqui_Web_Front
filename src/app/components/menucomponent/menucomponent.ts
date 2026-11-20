import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  LucideBell,
  LucideCalendarDays,
  LucideChartColumn,
  LucideChartColumnStacked,
  LucideClipboardList,
  LucideClock3,
  LucideFilePlus,
  LucideFileText,
  LucideHeartPulse,
  LucideHouse,
  LucideList,
  LucideNotebookPen,
  LucidePill,
  LucideSearch,
  LucideSend,
  LucideShieldCheck,
  LucideStethoscope,
  LucideTimer,
  LucideUsers,
} from '@lucide/angular';

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
    LucideClipboardList,
    LucideClock3,
    LucideFilePlus,
    LucideFileText,
    LucideHeartPulse,
    LucideHouse,
    LucideList,
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
export class Menucomponent { }
