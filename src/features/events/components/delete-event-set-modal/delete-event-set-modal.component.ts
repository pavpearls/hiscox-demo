import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventSet, Event } from '@shared/api-services/models';
import { ColDef, GridApi, GridReadyEvent, ITextFilterParams, RowSelectedEvent, RowSelectionOptions, ValueFormatterParams } from 'ag-grid-community';
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

  modalWidth: string | number = '80%';
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

  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };

  constructor(
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    if (this.eventSet && this.eventSet.events) {
      this.initializeColumnDefs();
      this.rowData = this.eventSet.events;
    }
  }

  initializeColumnDefs(): void {
    this.columnDefs = [
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region Peril',
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
      },
      {
        field: 'eventID',
        headerName: 'Event ID',
      },
      {
        field: 'createdBy',
        headerName: 'Created By',
      },
      {
        field: 'createDate',
        headerName: 'Created Date',
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss Estimate',
      },
      {
        field: 'isRestrictedAccess',
        headerName: 'Restricted',
      },
      {
        field: 'isArchived',
        headerName: 'Archived',
      },
    ];
  }

  onRowSelected(event: RowSelectedEvent): void {
    const selectedRows = this.gridApi.getSelectedRows();
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
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: null });
    } else {
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: selectedEventIds });
    }
    this.closeModal();
  }

  closeModal(): void {
    this.onCancel.emit();
  }
}
