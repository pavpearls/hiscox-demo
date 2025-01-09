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
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IDetailCellRendererParams,
  ITooltipParams,
  RowSelectionOptions,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

/** Interfaces for clarity (import your real ones as needed) **/
// import { EventSet, Event } from '@shared/api-services/models'; 
// interface EventSetMember { ... }

function dateFormatter(params: ValueFormatterParams) {
  return params.value ? moment(params.value).format('DD/MM/YYYY') : '';
}

@Component({
  selector: 'app-event-set-table',
  templateUrl: './event-set-table.component.html',
  styleUrls: ['./event-set-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSetTableComponent implements OnInit, OnChanges {
  @Input() eventSetData: any[] = [];
  @Output() new = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any[]>();
  @Output() edit = new EventEmitter<any>();

  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1 };
  public rowData: any[] = [];
  public tooltipShowDelay = 200;
  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'singleRow',
  };
  public paginationPageSizeSelector = [10, 25, 50, 100];
  public paginationPageSize = 25;

  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
      type: 'fitCellContents',
    };

  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    // private eventsFacade: EventsFacade, // If you need to call the facade directly from here
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventSetData'] && changes['eventSetData'].currentValue) {
      // Make a copy of the incoming array to avoid direct mutation
      this.rowData = [...this.eventSetData];
    }
  }

  ngOnInit(): void {
    this.columnDefs = this.getColumns();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.autoSizeAllColumns();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    setTimeout(() => {
      const node1 = params.api.getDisplayedRowAtIndex(0);
      if (node1) {
        node1.setExpanded(true);
      }
    }, 0);
  }

  // ---------------------------------------
  // Columns for the MASTER grid
  // ---------------------------------------
  getColumns(): ColDef[] {
    return [
      {
        field: 'eventSetID',
        headerName: 'Set ID',
        cellRenderer: 'agGroupCellRenderer',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventSetName',
        headerName: 'Event Set Name',
        sortable: true,
        cellStyle: { fontWeight: 'bold' },
      },
      {
        field: 'createDate',
        headerName: 'Create Date',
        sortable: true,
        valueFormatter: dateFormatter,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'createdBy',
        headerName: 'Create User',
        sortable: true,
      },
    ];
  }

  // ---------------------------------------
  // Columns for the DETAIL grid (non-RDS)
  // ---------------------------------------
  getDetailColumnDefs(): ColDef[] {
    return [
      {
        field: 'simYear',
        headerName: 'Sim Year',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventID',
        headerName: 'ID',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
        sortable: true,
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
        sortable: true,
        cellStyle: { fontWeight: 'bold' },
        tooltipValueGetter: (p: ITooltipParams) => p.data.eventNameLong,
        headerTooltip: 'Event Description',
      },
      {
        field: 'eventDate',
        headerName: 'Event Date',
        sortable: true,
        valueFormatter: dateFormatter,
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region Peril',
        sortable: true,
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Impact',
        sortable: true,
      },
    ];
  }

  // ---------------------------------------
  // Columns for the DETAIL grid (RDS)
  // ---------------------------------------
  getRDSDetailColumnDefs(): ColDef[] {
    return [
      {
        field: 'simYear',
        headerName: 'Sim Year',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventID',
        headerName: 'ID',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
        sortable: true,
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
        sortable: true,
        tooltipValueGetter: (p: ITooltipParams) => p.data.eventNameLong,
        headerTooltip: 'Event Description',
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region Peril',
        sortable: true,
      },
    ];
  }

  // ---------------------------------------
  // MASTER-DETAIL: Provide detail rows
  // And handle onCellValueChanged in detail
  // ---------------------------------------
  public detailCellRendererParams: any = (masterParams: ICellRendererParams) => {
    const res = {} as IDetailCellRendererParams;

    // Supply a copy of the child "events" array to the detail grid
    res.getDetailRowData = (detailParams: any) => {
      // Create a fresh array (avoid read-only objects)
      const eventsCopy = masterParams.data.events?.map((evt: any) => ({ ...evt })) || [];
      detailParams.successCallback(eventsCopy);
    };

    // Decide which columns based on eventTypeID
    if (masterParams.data.eventTypeID === 1) {
      // RDS
      res.detailGridOptions = {
        columnDefs: this.getRDSDetailColumnDefs(),
        defaultColDef: { flex: 1, editable: true },
        onCellValueChanged: (e: any) => this.onDetailCellValueChanged(e, masterParams.data),
      };
    } else {
      res.detailGridOptions = {
        columnDefs: this.getDetailColumnDefs(),
        defaultColDef: { flex: 1, editable: true },
        onCellValueChanged: (e: any) => this.onDetailCellValueChanged(e, masterParams.data),
      };
    }

    return res;
  };

  // This method is called whenever a cell in the detail grid changes
  onDetailCellValueChanged(detailEvent: any, parentRowData: any): void {
    const { data: changedChildRow, colDef, newValue, oldValue } = detailEvent;
    if (newValue === oldValue) return;

    // 1) Build a new array of child events (immutably updated)
    const updatedEvents = parentRowData.events.map((evt: any) => {
      if (evt.eventID === changedChildRow.eventID) {
        // Return a fresh copy with updated field
        return { ...evt, [colDef.field]: newValue };
      }
      return evt;
    });

    // 2) Create a new copy of the parent row with updated events
    const updatedParentRow = {
      ...parentRowData,
      events: updatedEvents,
      // Optionally set modifiedBy, etc.
    };

    // 3) Replace the parent row in this.rowData
    this.rowData = this.rowData.map((row) =>
      row.eventSetID === updatedParentRow.eventSetID ? updatedParentRow : row
    );

    // 4) Transform updatedParentRow into the structure your API expects
    const payload = this.transformEventSetForUpdate(updatedParentRow);

    // 5) (Optional) Call your API/Facade to persist the change
    // e.g.
    // this.eventsFacade.actions.eventSets.updateEventSet(payload);

    console.log(
      `Detail column "${colDef.field}" changed from "${oldValue}" to "${newValue}".`
    );
    console.log('Updated parent row with changed detail row:', updatedParentRow);
    console.log('Transformed payload for API:', payload);
  }

  /**
   * Converts the updatedParentRow (which has a "events" array)
   * into an EventSet structure that has "eventSetMembers".
   */
  private transformEventSetForUpdate(updatedParentRow: any): any {
    return {
      eventSetID: updatedParentRow.eventSetID,
      eventSetTypeID: updatedParentRow.eventSetTypeID,
      eventSetName: updatedParentRow.eventSetName,
      eventSetDescription: updatedParentRow.eventSetDescription,
      isArchived: updatedParentRow.isArchived,
      createdBy: updatedParentRow.createdBy,
      modifiedBy: updatedParentRow.modifiedBy,
      createDate: updatedParentRow.createDate,

      // Convert each `event` to `EventSetMember`
      eventSetMembers: updatedParentRow.events?.map((evt: any) => ({
        eventSetMemberID: evt.eventSetMemberID ?? 0, // or undefined
        eventID: evt.eventID,
        eventSetID: updatedParentRow.eventSetID,
        simYear: evt.simYear,
        eventOrder: evt.eventOrder,
        createdBy: evt.createdBy,
        modifiedBy: evt.modifiedBy,

        // If needed, nest the event object
        event: {
          eventID: evt.eventID,
          eventTypeID: evt.eventTypeID,
          regionPerilID: evt.regionPerilID,
          eventNameShort: evt.eventNameShort,
          eventNameLong: evt.eventNameLong,
          eventDate: evt.eventDate,
          industryLossEstimate: evt.industryLossEstimate,
          hiscoxLossImpactRating: evt.hiscoxLossImpactRating,
          createdBy: evt.createdBy,
          modifiedBy: evt.modifiedBy,
          createDate: evt.createDate,
          isLossPick: evt.isLossPick,
          isRestrictedAccess: evt.isRestrictedAccess,
          isArchived: evt.isArchived,
        },
      })) ?? [],
    };
  }

  // ---------------------------------------
  // MASTER Grid CRUD Buttons
  // ---------------------------------------
  onDeleteClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.modal.warning({
        nzTitle: 'No Rows Selected',
        nzContent: 'Please select rows to delete.',
      });
      return;
    }
    // Emit to parent
    this.delete.emit(selectedRows);
  }

  onEditClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.modal.warning({
        nzTitle: 'No Rows Selected',
        nzContent: 'Please select rows to edit.',
      });
      return;
    }
    // Emit to parent
    this.edit.emit(selectedRows[0]);
  }
}
