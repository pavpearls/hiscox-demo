import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';
import { Event } from '@shared/api-services/models';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'app-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss'],
    standalone: true,
    imports: [NzTableModule, NzButtonModule, NzRadioModule, NzGridModule, FormsModule, CommonModule]
})
export class EventsTableComponent {
   private _events: Event[] | undefined = undefined;

  @Input() set events(value: Event[] | undefined) {
    this._events = value;
    if (this._events) {
      this.data = this._events.map((event: any) => this.transformEventDataItem(event));
      this.columns = this.generateColumns();
    }
  }
  indeterminate = false;
  columns: EventColumnItem[] = [];
  data: EventDataItem[] = [];
  pageSize = 10;
  setOfCheckedId = new Set<number>();
  checked = false;

  private generateColumns(): EventColumnItem[] {
    return [
      {
        name: 'Event ID',
        sortOrder: null,
        sortFn: (a, b) => a.eventId - b.eventId,
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Event Type',
        sortOrder: null,
        sortFn: (a, b) => a.eventType.localeCompare(b.eventType),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('eventType'),
        filterFn: (filter, item) => filter.includes(item.eventType)
      },
      {
        name: 'Event Name',
        sortOrder: null,
        sortFn: (a, b) => a.eventName.localeCompare(b.eventName),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('eventName'),
        filterFn: (filter, item) => filter.includes(item.eventName)
      },
      {
        name: 'Region-Peril',
        sortOrder: null,
        sortFn: (a, b) => a.regionPeril.localeCompare(b.regionPeril),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('regionPeril'),
        filterFn: (filter, item) => filter.includes(item.regionPeril)
      },
      {
        name: 'Created By',
        sortOrder: null,
        sortFn: (a, b) => a.createdBy.localeCompare(b.createdBy),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Created Date',
        sortOrder: null,
        sortFn: (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Restricted',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
        filterFn: (filter, item) => filter.includes(item.restricted)
      },
      {
        name: 'Archived',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
        filterFn: (filter, item) => filter.includes(item.archived)
      }
    ];
  }

  private transformEventDataItem(item: Event): EventDataItem {
    return {
      eventId: item.eventID as any,
      eventType: item.eventType?.eventTypeName || '<No Data>',
      eventName: item.eventNameShort || '<No Data>',
      regionPeril: item.regionPeril?.regionPerilName || '<No Data>',
      createdBy: item.createUser?.userName || '<No Data>',
      createdDate: item.createDate ? new Date(item.createDate).toLocaleDateString('en-GB') : '<No Date>',
      restricted: item.isRestrictedAccess ? 'Yes' : 'No',
      archived: item.isArchived ? 'Yes' : 'No'
    };
  }

  private generateFilterList(field: keyof EventDataItem): { text: string; value: string }[] {
    const uniqueValues = [...new Set(this.data.map(item => item[field]))];
    return uniqueValues.map(value => ({ text: String(value), value: String(value) }));
  }

  setPageSize(size: number): void {
    this.pageSize = size;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }
}