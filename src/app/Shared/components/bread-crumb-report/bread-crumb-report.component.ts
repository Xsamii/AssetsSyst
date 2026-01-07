import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-bread-crumb-report',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownModule, MenuModule],
  templateUrl: './bread-crumb-report.component.html',
  styleUrls: ['./bread-crumb-report.component.scss'],
})
export class BreadCrumbReportComponent implements OnInit {
  @Input() imageTitle: string = '';
  @Input() isFilte: boolean = false;
  @Input() inputPlaceholder: string = '';
  @Input() buttonText: string = '';
  @Input() isShowFilter: boolean = true;
  @Input() isShowAddEdite: boolean = false;
  @Input() showAddButton: boolean = true;
  @Output() addButton = new EventEmitter();
  @Output() valueSearch = new EventEmitter();
  @Output() onFilterClick = new EventEmitter();
  @Output() BackButton = new EventEmitter();
  items: MenuItem[] | undefined;
  ngOnInit(): void {
    this.items = [
      {
        label: 'تحميل التقرير Excel',
        icon: 'pi pi-file-excel',
        command: () => {
          this.addButtonFun('excel');
        },
      },
      {
        label: 'تحميل التقرير Word',
        icon: 'pi pi-file-word',
        command: () => {
          this.addButtonFun('word');
        },
      },
      {
        label: 'تحميل التقرير Pdf',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.addButtonFun('pdf');
        },
      },
    ];
  }
  addButtonFun(typeFile: string) {
    this.addButton.emit(typeFile);
  }
  valueSearchFun(value: string) {
    this.valueSearch.emit(value);
  }
  onFilterClickFun() {
    this.onFilterClick.emit();
  }
  backButton() {
    this.BackButton.emit();
  }
}
