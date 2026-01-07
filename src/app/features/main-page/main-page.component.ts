import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from 'src/app/Shared/components/navbar/navbar.component';
import { ProfileService } from 'src/app/Shared/components/profile/services/profile.service';
import { MainSidebarComponent } from '../../Shared/components/sidebars/main-sidebar/main-sidebar.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ChatService } from 'src/app/Shared/services/chat.service';
import { marked } from 'marked';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, NavbarComponent, MainSidebarComponent, CommonModule,OverlayPanelModule,FormsModule ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, AfterViewChecked {
  showSidebarMenu: boolean = true;
  @ViewChild('myDiv') myDiv!: ElementRef;
  showChat: boolean = true;
  question: string = '';
  questionsAndAnswers: any[] = [];
  chatHistory: any[] = [];
  answer;
  selectedQuestion;
  @ViewChild('writeQuestionRef') writeQuestionRef!: ElementRef;
  @ViewChild('chatContentRef') chatContentRef!: ElementRef;
  loading: boolean = false;
  errorMessage;
  userName = localStorage.getItem('pmsUserName') || '';
  userRole = localStorage.getItem('maintainanceRole') || '';
  constructor(
    private _router: Router,
    private _profileService: ProfileService,
    private sharedService: SharedService,
    private chatService: ChatService
  ) {}
  ngOnInit(): void {
    this.showChat=+this.userRole==1
    if ('maintainanceToken' in localStorage) {
      const isBaseUrl = this._router.url === '/';
      if (isBaseUrl) this.sharedService.goToHome();
      this.loadDisplaySideBarSetting();
    } else {
      this._router.navigate(['/auth']);
    }
  }

  loadDisplaySideBarSetting() {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });
  }

  ngAfterViewChecked() {
    const asseturl =
      this._router.url.includes('/buildings/assets/add') ||
      this._router.url.includes('/buildings/assets/edit') ||
      this._router.url.includes('/buildings/assets/maintenance-log-view') ||
      this._router.url.includes(
        '/buildings/assets/maintenance-inspection-log-view'
      );
    if (asseturl) {
      this.myDiv.nativeElement.style.background = 'none';
      this.myDiv.nativeElement.style.padding = '0';
    } else {
      this.myDiv.nativeElement.style.background = 'white';
      this.myDiv.nativeElement.style.padding = '24px';
    }
  }
  positionOverlay(overlayPanel: OverlayPanel) {
    setTimeout(() => {
      const el = overlayPanel.container as HTMLElement;
      if (el) {
        el.style.position = 'fixed';
        el.style.bottom = '9vh';
        el.style.right = '3%';
        el.style.left = 'auto';
        el.style.top = 'auto';
      }
    });
  }

  scrollToWriteQuestion() {
    const container = this.chatContentRef.nativeElement;
    const target = this.writeQuestionRef.nativeElement;
    container.scrollTo({
      top: target.offsetTop - container.offsetTop,
      behavior: 'smooth',
    });
  }

  scrollToBottom() {
    try {
      const container = this.chatContentRef.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
  send() {
    if (this.question.trim()) {
      this.selectedQuestion = this.question;
      this.questionsAndAnswers.push({
        question: this.selectedQuestion,
        answer: null,
        loading: true,
        error: false,
      });
      this.question = null;
      setTimeout(() => this.scrollToBottom(), 100);
      this.chatService.send({ message: this.selectedQuestion }).subscribe(
        (data: any) => {
          this.questionsAndAnswers[
            this.questionsAndAnswers.length - 1
          ].loading = false;
          if (data.success) {
            this.answer = data.response;
            this.questionsAndAnswers[
              this.questionsAndAnswers.length - 1
            ].answer = this.answer; // 👈 تحديث آخر عنصر
          } else {
            this.errorMessage = data.response;
            this.questionsAndAnswers[
              this.questionsAndAnswers.length - 1
            ].answer = this.errorMessage;
            this.questionsAndAnswers[
              this.questionsAndAnswers.length - 1
            ].error = true;
          }
          setTimeout(() => this.scrollToBottom(), 100);
        },
        (error) => {
          this.errorMessage = 'هناك خطأ ما حاول مجدداً';
          this.questionsAndAnswers[
            this.questionsAndAnswers.length - 1
          ].loading = false;
          this.questionsAndAnswers[this.questionsAndAnswers.length - 1].answer =
            this.errorMessage;
          this.questionsAndAnswers[this.questionsAndAnswers.length - 1].error =
            true;
          this.scrollToBottom();
        }
      );
    }
  }

  formatAnswer(answer: string): string {
    return marked.parse(answer) as string;
  }
}
