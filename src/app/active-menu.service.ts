import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveMenuService {
  private activeMenuItem = new BehaviorSubject<string>('');

  setActiveMenuItem(menuItem: string) {
    this.activeMenuItem.next(menuItem);
  }

  getActiveMenuItem() {
    return this.activeMenuItem.asObservable();
  } 
}
