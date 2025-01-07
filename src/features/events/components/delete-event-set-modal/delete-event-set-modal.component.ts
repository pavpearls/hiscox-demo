import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventSet, Event } from '@shared/api-services/models';
import { ColDef, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-delete-event-set-modal',
  templateUrl: './delete-event-set-modal.component.html',
  styleUrls: ['./delete-event-set-modal.component.scss']
})
export class DeleteEventSetModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() eventSet: EventSet | null = null;
  @Output() onConfirm: EventEmitter<{ eventSetId: number, eventIds: number[] | null }> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };
  public rowData: Event[] = [];
  public gridApi!: GridApi;
  public selectAll: boolean = false;

  constructor(
    private modal: NzModalRef,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    if (this.eventSet && this.eventSet.events) {
      this.rowData = this.eventSet.events;
    }
    this.initializeColumnDefs();
  }

  initializeColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: '',
        field: 'checkbox',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        suppressMenu: true,
        pinned: 'left'
      },
      {
        field: 'simYear',
        headerName: 'Sim Year',
        cellStyle: { 'text-align': 'center' },
        width: 100
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        cellStyle: { 'text-align': 'center' },
        width: 80
      },
      {
        field: 'eventID',
        headerName: 'ID',
        cellStyle: { 'text-align': 'center' },
        width: 80
      },
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
        cellStyle: { 'text-align': 'left' },
        width: 150
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
        cellStyle: { 'font-weight': 'bold', 'text-align': 'left' },
        tooltipField: 'eventNameLong',
        headerTooltip: 'Event Description',
        width: 200
      },
      {
        field: 'eventDate',
        headerName: 'Event Date',
        valueFormatter: this.dateFormatter,
        cellStyle: { 'text-align': 'center' },
        width: 120
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region Peril',
        cellStyle: { 'text-align': 'left' },
        width: 150
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss',
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.currencyFormatter,
        width: 130
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Impact',
        cellStyle: { 'text-align': 'center' },
        width: 130
      },
    ];
  }

  dateFormatter(params: ValueFormatterParams): string {
    return params.value ? new Date(params.value).toLocaleDateString('en-GB') : '';
  }

  currencyFormatter(params: ValueFormatterParams): string {
    return params.value != null ? `$${params.value.toLocaleString()}` : '';
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.gridApi.selectAll();
    } else {
      this.gridApi.deselectAll();
    }
  }

  confirmDeletion(): void {
    if (!this.eventSet) {
      this.notification.error('Error', 'No Event Set selected for deletion.');
      return;
    }

    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedEventIds = selectedNodes.map(node => node.data.eventID);

    if (selectedEventIds.length === 0) {
      this.notification.warning('No Selection', 'Please select at least one event to delete.');
      return;
    }

    if (selectedEventIds.length === this.eventSet?.events?.length) {
      // User selected all events; treat as deleting entire event set
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: null });
    } else {
      // User selected specific events to delete
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: selectedEventIds });
    }

    this.closeModal();
  }

  closeModal(): void {
    this.onCancel.emit();
    this.modal.destroy();
  }
}
