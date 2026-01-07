import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sweet-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sweet-alert-message.component.html',
  styleUrls: ['./sweet-alert-message.component.scss'],
})
export class SweetAlertMessageComponent {
  @Input() data = { type: '', text: '', buttonText: '' };
  @Output() confirmMessage = new EventEmitter<boolean>();

  handleClick(value: boolean) {
    this.confirmMessage.emit(value);
  }
}
