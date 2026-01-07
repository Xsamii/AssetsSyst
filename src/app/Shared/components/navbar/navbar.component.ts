import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile/services/profile.service';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './services/notifications.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, DoCheck {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  showSidebarMenu: boolean = true;
  moduleName: string = "منصة إدارة أصول و مرافق الأضاحي";
  showMenuIcon: boolean = false;
  showLogoutMenu: boolean = false;
  showNotificationList: boolean = false;
  email = localStorage.getItem('maintainanceEmail');
  profileImage;
  fullName;
  jobName;
  allNotifications: any[] = [];
  // ------------------------------------
  // CONSTRUCTOUR
  // ------------------------------------
  constructor(
    private sharedService: SharedService,
    private _router: Router,
    private _profileService: ProfileService,
    private _notificationsService: NotificationsService,
    private elementRef: ElementRef
  ) { }
  // ------------------------------------
  // CLOSE SIDEBAR MENU
  // ------------------------------------
  closeSidebarMenu() {
    this.showSidebarMenu = !this.showSidebarMenu;
    this.sharedService.showSideMenuFun(this.showSidebarMenu);
  }

  // ------------------------------------
  // CHANGE NAVBAR TITLE
  // ------------------------------------

  // ------------------------------------
  // LOGOUT MENU
  // ------------------------------------

  onShowLogoutMenu(event: Event): void {
    this.showLogoutMenu = !this.showLogoutMenu;
    event.stopPropagation(); // Prevent the click from propagating to the document
  }

  // HostListener to detect clicks outside the dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    // Close the dropdown if the click is outside the elementRef (navbar and dropdown toggle)
    if (!clickedInside) {
      this.showLogoutMenu = false;
    }
  }


  // ------------------------------------
  // LOGOUT
  // ------------------------------------

  logout() {
    localStorage.clear();
    this._router.navigate(['/auth']);
  }
  // profile/notifications
  // ------------------------------------
  // route To Profile
  // ------------------------------------
  routeToProfile() {
    const profilePage = this._router.url.split('/')[1];
    if (profilePage == 'notifications') {
      this._router.navigate([`/profile`]);
    } else {
      this._router.navigate([`/${profilePage}/profile`]);
    }
    this.showLogoutMenu = false;
  }
  // ------------------------------------
  // route To Notifications
  // ------------------------------------
  routeToNotifications() {
    const notificationsPage = this._router.url.split('/')[1];
    if (notificationsPage == 'profile') {
      this._router.navigate([`/notifications`]);
    } else {
      this._router.navigate([`/${notificationsPage}/notifications`]);
    }
    this.showNotificationList = false;
  }

  // =============================
  // ALL NOTIFICATIONS
  // =============================
  getAllNotifications() {
    this._notificationsService.getAllNotifications().subscribe((res) => {
      this.allNotifications = res;
    });
  }
  // =============================
  // Read Notification
  // =============================
  readNotification(notifi: any) {

    this._notificationsService.readNotification(notifi.id).subscribe((res) => {
      this.getAllNotifications();
      this.getAllNotreadNotification();
      switch (notifi.notificationTypeId) {
        case 1:
        case 2:
        case 3: {
          this._router.navigate(['/projects/projects-menu']);
          break;
        }
        case 4: {
          window.location.href = `/projects/visit-requests/incoming-requests/request-details/${notifi.maintenanceRequestId}`;
          break;
        }
        case 5:
        case 6:
        case 7:
        case 8:
          {
            this._router.navigate(['/buildings/maintenace-requests/details/' + notifi.maintenanceRequestId])

            // window.location.href = `/projects/visit-requests/specified-requests/request-details/${notifi.visitRequestId}`;
            break;
          }
        case 9:
        case 10:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
          {
            this._router.navigate(['/buildings/maintenace-requests/details/' + notifi.maintenanceRequestId])
          }
      }

      // maintenanceRequestId
      // visitRequestId
    });
  }
  // ===================================
  // FILTERS UNREAD NOTIFICATIONS
  // ===================================
  numberOfNotifications;
  allnotificationsNotRead: any[] = [];
  unReadNotificationsIds: any[] = [];
  getAllNotreadNotification() {
    this._notificationsService.getAllNotifications().subscribe((res) => {
      this.allnotificationsNotRead = res.filter((el) => el.isRead === false);
      this.numberOfNotifications = this.allnotificationsNotRead.length;
      this.unReadNotificationsIds = this.allnotificationsNotRead.map(
        (el) => el.id
      );
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
        this.getAllNotreadNotification();
      });
  }

  // ===============================
  // get Access Token
  // ===============================

  getAccessToken(): any {
    return localStorage.getItem('maintainanceToken');
  }
  // ===============================
  // SIGNAL R
  // ===============================
  private _hubConnection: HubConnection;
  startConnection() {
    // this._hubConnection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Information)
    //   .withAutomaticReconnect()
    //   .withUrl(`${environment.notificationBaseUrl}/notifications`, {
    //     accessTokenFactory: () => this.getAccessToken(),
    //     withCredentials: false,
    //   })
    //   .build();
    // this._hubConnection
    //   .start()
    //   .then(() =>  )
    //   .catch((err) => {
    //   });
    // this._hubConnection.on('Send', (message) => {
    //   this.getAllNotifications();
    // });
  }
  // ------------------------------------
  // DOCHECK
  // ------------------------------------
  ngDoCheck(): void {
    this._profileService.profileImage.subscribe((value) => {

      this.profileImage = value.imgSrc;
      // this.fullName = value.fullName;
      // this.jobName = value.jobName;
    });

  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });
    this.startConnection();
    this.getAllNotifications();
    this.getAllNotreadNotification();

    this._profileService.getProfile().subscribe((res) => {

      this.fullName = res?.data?.fullName;
      localStorage.setItem('pmsUserName', this.fullName)
      this.jobName = res?.data?.jobName;
    })


  }

  clickToHome() {
    this.sharedService.goToHome();
  }
}
