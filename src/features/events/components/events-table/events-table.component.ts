import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';

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

    pageSize: number = 10;

    setPageSize(size: number): void {
        this.pageSize = size;
    }
}