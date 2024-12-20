import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
  } from '@angular/core';
  import { ColDef, GridApi, CellValueChangedEvent } from 'ag-grid-community';
  import { Event } from '@shared/api-services/models';
  
  @Component({
    selector: 'app-current-event-set-table',
    templateUrl: './current-event-set-table.component.html',
    styleUrls: ['./current-event-set-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AppCurrentEventSetTableComponent implements OnInit, OnChanges {
    @Input() events: Event[] = [];
    @Output() eventsChanged = new EventEmitter<Event[]>();
  
    private gridApi!: GridApi;
  
    // Define columns for inline editing. Here we assume simYear and eventOrder are numeric or strings,
    // and eventNameShort is a string. Adjust as needed for your data model.
    columnDefs: ColDef[] = [
      {
        field: 'eventID',
        headerName: 'Event ID',
        checkboxSelection: true,
        sortable: true,
        flex: 1,
      },
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
        sortable: true,
        flex: 1,
        editable: false,
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
        sortable: true,
        flex: 2,
        editable: true, // Inline editing enabled
        tooltipField: 'eventNameLong',
      },
      {
        field: 'simYear',
        headerName: 'Sim Year',
        sortable: true,
        flex: 1,
        editable: true, // Inline editing enabled
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        flex: 1,
        editable: true, // Inline editing enabled
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region-Peril',
        sortable: true,
        flex: 2,
        editable: false,
      },
      {
        field: 'eventDate',
        headerName: 'Event Date',
        sortable: true,
        flex: 1,
        editable: false,
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss (Billion USD)',
        sortable: true,
        flex: 2,
        editable: false,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Loss Impact',
        sortable: true,
        flex: 2,
        editable: false,
      },
      {
        field: 'createdBy',
        headerName: 'Created By',
        sortable: true,
        flex: 1,
        editable: false,
      },
      {
        field: 'createDate',
        headerName: 'Created Date',
        sortable: true,
        flex: 1,
        editable: false,
      },
    ];
  
    defaultColDef: ColDef = {
      resizable: true,
    };
  
    rowData: Event[] = [];
  
    ngOnInit(): void {
      this.rowData = [...this.events];
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['events'] && this.events) {
        this.rowData = [...this.events];
      }
    }
  
    onGridReady(params: any): void {
      this.gridApi = params.api;
    }
  
    onRemoveSelected(): void {
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        return; // Ideally show a warning that no rows are selected
      }
  
      // Remove selected rows from the internal array
      this.rowData = this.rowData.filter(evt => !selectedRows.includes(evt));
      this.eventsChanged.emit(this.rowData);
    //   this.gridApi.setRowData(this.rowData);
    }
  
    onCellValueChanged(event: CellValueChangedEvent): void {
      // This event is fired after inline editing
      // The updated row is already in the rowData array, but we need to ensure we emit the changes.
      // Find the index of the changed event by a unique ID (assuming eventID is unique)
      const updatedEvent = event.data as Event;
      const index = this.rowData.findIndex(e => e.eventID === updatedEvent.eventID);
      if (index > -1) {
        this.rowData[index] = { ...updatedEvent };
        // Emit updated events list
        this.eventsChanged.emit(this.rowData);
      }
    }
  }
  