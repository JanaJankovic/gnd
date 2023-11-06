import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {
  private eventSource = new Subject<string>();

  loginEvent$ = this.eventSource.asObservable();
  deleteUserEvent$ = this.eventSource.asObservable();
  itemUpdated$ = this.eventSource.asObservable();

  loginEvent(obj: any) {
    this.eventSource.next(obj);
  }

  deleteEvent() {
    this.eventSource.next('User deleted');
  }

  itemUpdated() {
    this.eventSource.next('Item updated');
  }
}
