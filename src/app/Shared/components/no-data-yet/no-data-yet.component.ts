import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-data-yet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-data-yet.component.html',
  styleUrls: ['./no-data-yet.component.scss'],
})
export class NoDataYetComponent {

  @Input() noDataElements = {
    noDataImg: '',
    noDataText: '',
    noDataButtonText: '',
  };
  @Input() showButton: boolean = true;
  @Output() addNewEvent = new EventEmitter();
  @Input() marginForList: boolean = false;
  addNew() {
    this.addNewEvent.emit();
  }
}
