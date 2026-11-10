import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  LucideCalendarDays,
  LucideClipboardList,
  LucideFilePlus,
  LucideFileText,
  LucideHeartPulse,
  LucideHouse,
  LucideList,
  LucidePill,
} from '@lucide/angular';

@Component({
  selector: 'app-menucomponent',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    LucideCalendarDays,
    LucideClipboardList,
    LucideFilePlus,
    LucideFileText,
    LucideHeartPulse,
    LucideHouse,
    LucideList,
    LucidePill,
  ],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent { }
