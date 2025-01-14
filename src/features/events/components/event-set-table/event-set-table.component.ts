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
import { EventsFacade } from '@events//store/events.facade';
import { EventSet } from '@shared/api-services/eventSet';
import { EventSetMember } from '@shared/api-services/eventSetMember';
import { EventSetRequest } from '@shared/api-services/eventSetRequest';
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
import { filterSuccess, success } from 'ngx-remotedata';
import { take } from 'rxjs';


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
    private eventsFacade: EventsFacade,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventSetData'] && changes['eventSetData'].currentValue) {
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

  public detailCellRendererParams: any = (masterParams: ICellRendererParams) => {
    const res = {} as IDetailCellRendererParams;

    res.getDetailRowData = (detailParams: any) => {
      const eventsCopy = masterParams.data.events?.map((evt: any) => ({ ...evt })) || [];
      detailParams.successCallback(eventsCopy);
    };

    if (masterParams.data.eventTypeID === 1) {
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

  onDetailCellValueChanged(detailEvent: any, parentRowData: any): void {
    const { data: changedChildRow, colDef, newValue, oldValue } = detailEvent;
    if (newValue === oldValue) return;

    const updatedEvents = parentRowData.events.map((evt: any) => {
      if (evt.eventID === changedChildRow.eventID) {
        return { ...evt, [colDef.field]: newValue };
      }
      return evt;
    });

    const updatedParentRow = {
      ...parentRowData,
      events: updatedEvents,
    };

    let eventSetsMembers: EventSetMember[] = [];
    let eventSetList: EventSet[] = [];

    this.eventsFacade.state.eventSetMemberships.membershipList$.pipe(filterSuccess()).pipe(take(1)).subscribe((data) => {
      eventSetsMembers = data.value;
    });

    this.eventsFacade.state.eventSets.getEventSetList$.pipe(filterSuccess()).pipe(take(1)).subscribe((data) => {
      eventSetList = data.value;
    });

    const {eventOrder, simYear} = changedChildRow;
    const eventSetMembers: EventSetMember[] | undefined = eventSetsMembers.filter(x =>x.eventSetID === updatedParentRow.eventSetID);
    const eventSetMember = eventSetMembers.find(x =>x.eventID === changedChildRow.eventID);
    const updatedEvent = updatedEvents.find((x: any) =>x.eventID ===changedChildRow.eventID);
    const eventSet = eventSetList.find(x =>x.eventSetID === updatedParentRow?.eventSetID);
    const mappedEventSet = {...eventSetMember, eventOrder, simYear, event: updatedEvent, eventSet};
    this.eventsFacade.actions.eventSetMemberships.updateMembership(mappedEventSet);
  }

  onDeleteClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.modal.warning({
        nzTitle: 'No Rows Selected',
        nzContent: 'Please select rows to delete.',
      });
      return;
    }
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
    this.edit.emit(selectedRows[0]);
  }
}
