import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventColumnItem, EventDataItem } from '../../../interfaces/events.interfaces';
import { Event } from '../../../../../shared/api-services/nds-api/generated/model/event';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsTableComponent implements OnInit {
  private _successValue: Event[] | null = null;

  @Input() set successValue(value: Event[] | null) {
    this._successValue = value;
    if (this._successValue) {
      this.data = this._successValue.map(event => this.transformEventDataItem(event));
      this.columns = this.generateColumns();
      this.updateEditCache();
    }
  }

  @Input() enableRowSelection = false;
  @Input() enableEditMode = false;

  @Output() edit = new EventEmitter<void>();
  @Output() copy = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() archive = new EventEmitter<void>();

  columns: EventColumnItem[] = [];
  data: EventDataItem[] = [];
  pageSize = 10;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly EventDataItem[] = [];
  setOfCheckedId = new Set<number>();

  editCache: { [key: number]: { edit: boolean; form: FormGroup } } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize data if necessary
  }

  onCurrentPageDataChange($event: readonly EventDataItem[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.eventId, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.eventId));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.eventId)) && !this.checked;
  }

  private generateColumns(): EventColumnItem[] {
    return [
      { name: 'Event ID', sortOrder: null, sortFn: (a, b) => a.eventId - b.eventId, sortDirections: ['ascend', 'descend', null], filterMultiple: false, listOfFilter: [], filterFn: null },
      { name: 'Event Type', sortOrder: null, sortFn: (a, b) => a.eventType.localeCompare(b.eventType), sortDirections: ['ascend', 'descend', null], filterMultiple: true, listOfFilter: this.generateFilterList('eventType'), filterFn: (filter, item) => filter.includes(item.eventType) },
      { name: 'Event Name', sortOrder: null, sortFn: (a, b) => a.eventName.localeCompare(b.eventName), sortDirections: ['ascend', 'descend', null], filterMultiple: true, listOfFilter: this.generateFilterList('eventName'), filterFn: (filter, item) => filter.includes(item.eventName) },
      { name: 'Region-Peril', sortOrder: null, sortFn: (a, b) => a.regionPeril.localeCompare(b.regionPeril), sortDirections: ['ascend', 'descend', null], filterMultiple: true, listOfFilter: this.generateFilterList('regionPeril'), filterFn: (filter, item) => filter.includes(item.regionPeril) },
      { name: 'Created By', sortOrder: null, sortFn: (a, b) => a.createdBy.localeCompare(b.createdBy), sortDirections: ['ascend', 'descend', null], filterMultiple: false, listOfFilter: [], filterFn: null },
      { name: 'Created Date', sortOrder: null, sortFn: (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(), sortDirections: ['ascend', 'descend', null], filterMultiple: false, listOfFilter: [], filterFn: null },
      { name: 'Restricted', sortOrder: null, sortFn: null, sortDirections: [null], filterMultiple: true, listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }], filterFn: (filter, item) => filter.includes(item.restricted) },
      { name: 'Archived', sortOrder: null, sortFn: null, sortDirections: [null], filterMultiple: true, listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }], filterFn: (filter, item) => filter.includes(item.archived) }
    ];
  }

  private transformEventDataItem(item: Event): EventDataItem {
    return {
      eventId: item.eventID,
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

  // Edit functionality methods with validation
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    this.editCache[id].edit = false;
  }

  saveEdit(id: number): void {
    if (this.editCache[id].form.valid) {
      const index = this.data.findIndex(item => item.eventId === id);
      Object.assign(this.data[index], this.editCache[id].form.value);
      this.editCache[id].edit = false;
    } else {
      this.editCache[id].form.markAllAsTouched();
    }
  }

  private updateEditCache(): void {
    this.data.forEach(item => {
      this.editCache[item.eventId] = {
        edit: false,
        form: this.fb.group({
          eventId: [item.eventId],
          eventType: [item.eventType, [Validators.required, Validators.maxLength(50)]],
          eventName: [item.eventName, [Validators.required, Validators.maxLength(100)]],
          regionPeril: [item.regionPeril],
          createdBy: [item.createdBy],
          createdDate: [item.createdDate],
          restricted: [item.restricted],
          archived: [item.archived]
        })
      };
    });
  }
}
