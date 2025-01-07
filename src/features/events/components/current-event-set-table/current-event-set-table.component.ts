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
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CurrentEventSetTableComponent implements OnInit, OnChanges {
    @Input() events: Event[] = [];
    @Output() eventsChanged = new EventEmitter<Event[]>();
  
    private gridApi!: GridApi;
  
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
        editable: true,
        tooltipField: 'eventNameLong',
      },
      {
        field: 'simYear',
        headerName: 'Sim Year',
        sortable: true,
        flex: 1,
        editable: true, 
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        flex: 1,
        editable: true, 
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
        return; 
      }
  
      this.rowData = this.rowData.filter(evt => !selectedRows.includes(evt));
      this.eventsChanged.emit(this.rowData);
    //   this.gridApi.setRowData(this.rowData);
    }
  
    onCellValueChanged(event: CellValueChangedEvent): void {
      const updatedEvent = event.data as Event;
      const index = this.rowData.findIndex(e => e.eventID === updatedEvent.eventID);
      if (index > -1) {
        this.rowData[index] = { ...updatedEvent };
        this.eventsChanged.emit(this.rowData);
      }
    }
  }
  