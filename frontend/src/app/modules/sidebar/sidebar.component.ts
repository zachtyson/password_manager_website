import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('open', style({ left: '0' })),
      state('closed', style({ left: '-15vw' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SidebarComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
