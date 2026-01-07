import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationsService } from '../navbar/services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  // =======================================
  // VALUES
  // =======================================
  curentRoute: any;
  allNotifications: any[] = [];
  allnotificationsNotRead: any[] = [];
  unReadNotificationsIds: any[] = [];
  // =======================================
  // CONSTRUCTOUR
  // =======================================
  constructor(
    private _router: Router,
    private _notificationsService: NotificationsService
  ) {}

  // =============================
  // ALL NOTIFICATIONS
  // =============================
  getAllNotifications() {
    this._notificationsService.getAllNotifications().subscribe((res) => {
      this.allNotifications = res;

      this.allnotificationsNotRead = this.allNotifications.filter(
        (el) => el.isRead === false
      );
      this.unReadNotificationsIds = this.allnotificationsNotRead.map(
        (el) => el.id
      );
    });
  }
  // =============================
  // Read Notification
  // =============================
  readNotification(notifi: any) {
    this._notificationsService.readNotification(notifi.id).subscribe((res) => {
      this.getAllNotifications(); 
    });

  }
  // ===================================
  // READ ALL NOTIFICATIONS
  // ===================================
  readAllNotifications() {
    this._notificationsService
      .ReadList(this.unReadNotificationsIds)
      .subscribe((_) => {
        this.getAllNotifications();
      });
  }

  // =======================================
  // ONINIT
  // =======================================
  ngOnInit(): void {
    this.curentRoute = this._router.url.split('/')[1];

    this.getAllNotifications();
  }
}
