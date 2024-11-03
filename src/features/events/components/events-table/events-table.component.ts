import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss'],
    standalone: true,
    imports: [NzTableModule, NzButtonModule, NzRadioModule, FormsModule, CommonModule]
})
export class EventsTableComponent {
    @Input() columns: EventColumnItem[] = [];
    @Input() data: EventDataItem[] = [];

    pageSize: number = 10; // Default page size

    setPageSize(size: number): void {
        this.pageSize = size;
      }
}