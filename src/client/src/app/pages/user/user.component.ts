import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { NetworkService } from 'src/app/services/network.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild('FileSelectInputDialog')
  FileSelectInputDialog!: ElementRef;

  user: any = {
    _id: '',
    fullname: '',
    email: '',
    password: '',
    image: '',
  };

  constructor(
    private networkService: NetworkService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user != null ? JSON.parse(user) : this.user;
  }

  async onUpdateClick() {
    const data = await lastValueFrom(this.networkService.updateUser(this.user));
    if (data.acknowledged) {
      alert('User updated');
    }

    if (data.error) {
      alert(data.error);
    }
  }

  async onDeleteClick() {
    const data = await lastValueFrom(this.networkService.delete(this.user._id));
    if (data.acknowledged) {
      alert('User deleted');
      this.eventService.deleteEvent();
      this.router.navigate(['/']);
    }
  }

  onImageClick() {
    const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
    e.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String: string = reader.result as string;
      this.user.image = base64String;
    };

    reader.readAsDataURL(file);
  }
}
