import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, AfterViewInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {
    if ('maintainanceToken' in localStorage) {
      this._router.navigate(['/']);
    }

}

ngAfterViewInit(): void {
  const videoElement = document.getElementById('bg-video') as HTMLVideoElement;
  if (videoElement) {
    videoElement.muted = true;  // Ensure the video is muted programmatically
  }
}

}



