import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../../../shared/api-services/nds-api/generated/model/event';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsTableComponent implements OnInit {
  private _successValue:  Event[] | null = null;

  @Input() set successValue(value: Event[] | null) {
    this._successValue = value;
    if (this._successValue) {
      this.rowData = this._successValue.map(event => this.transformEventDataItem(event));
    }
  }

  @Input() enableRowSelection = false;
  @Input() enableEditMode = false;

  @Output() edit = new EventEmitter<number>();
  @Output() copy = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();

  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  editCache: { [key: number]: { edit: boolean; form: FormGroup } } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.columnDefs = this.generateColumns();
  }

  private generateColumns(): ColDef[] {
    return [
      { field: 'eventId', headerName: 'Event ID', sortable: true, filter: 'agNumberColumnFilter' },
      { field: 'eventType', headerName: 'Event Type', sortable: true, filter: 'agTextColumnFilter' },
      { field: 'eventName', headerName: 'Event Name', sortable: true, filter: 'agTextColumnFilter' },
      { field: 'regionPeril', headerName: 'Region-Peril', sortable: true, filter: 'agTextColumnFilter' },
      { field: 'createdBy', headerName: 'Created By', sortable: true, filter: 'agTextColumnFilter' },
      {
        field: 'createdDate',
        headerName: 'Created Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        valueFormatter: params => params.value || '<No Date>',
      },
      {
        field: 'restricted',
        headerName: 'Restricted',
        filter: true,
        cellRenderer: (params: any) => (params.value === 'Yes' ? 'Yes' : 'No'),
      },
      {
        field: 'archived',
        headerName: 'Archived',
        filter: true,
        cellRenderer: (params: any) => (params.value === 'Yes' ? 'Yes' : 'No'),
      },
      ...(this.enableEditMode
        ? [
            {
              field: 'action',
              headerName: 'Action',
              cellRenderer: this.actionCellRenderer.bind(this),
            },
          ]
        : []),
    ];
  }

  private transformEventDataItem(event: Event): any {
    return {
      eventId: event.eventID || '<No Data>',
      eventType: event.eventType?.eventTypeName || '<No Data>',
      eventName: event.eventNameShort || '<No Data>',
      regionPeril: event.regionPeril?.regionPerilName || '<No Data>',
      createdBy: event.createUser?.userName || '<No Data>',
      createdDate: event.createDate ? new Date(event.createDate).toLocaleDateString('en-GB') : '<No Date>',
      restricted: event.isRestrictedAccess ? 'Yes' : 'No',
      archived: event.isArchived ? 'Yes' : 'No',
    };
  }

  private actionCellRenderer(params: any): string {
    const id = params.data.eventId;
    return `
      <a (click)="startEdit(${id})">Edit</a>
      <a (click)="delete.emit(${id})">Delete</a>
      <a (click)="archive.emit(${id})">Archive</a>
    `;
  }

  onRowSelected($event: any): void {

  }

  onCellClicked($event: any): void {

  }
}
