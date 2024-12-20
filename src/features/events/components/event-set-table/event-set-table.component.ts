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

function dateFormatter(params: ValueFormatterParams) {
  return params.value ? moment(params.value).format('DD/MM/YYYY') : '';
}

@Component({
  selector: 'app-event-set-table',
  templateUrl: './event-set-table.component.html',
  styleUrl: './event-set-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSetTableComponent implements OnInit, OnChanges {
  @Input() eventSetData: any[];
  @Output() new = new EventEmitter<Event>();
  @Output() delete = new EventEmitter<any[]>();

  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1 };
  public rowData!: any[];
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

  public detailCellRendererParams: any = (params: ICellRendererParams) => {
    var res = {} as IDetailCellRendererParams;

    res.getDetailRowData = function (params: any) {
      params.successCallback(params.data.events);
    };

    if (params.data.eventTypeID === 1) {
      res.detailGridOptions = {
        columnDefs: this.getRDSDetailColumnDefs(),
        defaultColDef: {
          flex: 1,
        },
      };
    } else {
      res.detailGridOptions = {
        columnDefs: this.getDetailColumnDefs(),
        defaultColDef: {
          flex: 1,
        },
      };
    }
    return res;
  };

  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventSetData'].currentValue) {
      this.rowData = this.eventSetData;
    }
  }

  ngOnInit(): void {
    this.columnDefs = this.getColumns();

  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.autoSizeAllColumns();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      var node1 = params.api.getDisplayedRowAtIndex(0)!;
      node1.setExpanded(true);
    }, 0);
  }

  getColumns(): ColDef[] {
    return [
      {
        field: 'eventSetID',
        headerName: 'Set ID',
        cellRenderer: 'agGroupCellRenderer',
        sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
      },
      { field: 'eventSetName',
        cellStyle: {fontWeight: 'bold'},
        headerName: 'Event Set Name', sortable: true },
      {
        field: 'createDate',
        headerName: 'Create Date',
        sortable: true, valueFormatter: dateFormatter,
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
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
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
      },
      {
        field: 'eventID',
        headerName: 'ID',
        sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
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
        cellStyle: {fontWeight: 'bold'},
        tooltipValueGetter: (p: ITooltipParams) => p.data.eventNameLong,
        headerTooltip: 'Event Description',
      },
      {
        field: 'eventDate',
        headerName: 'Event Date',
        sortable: true,
        valueFormatter: dateFormatter
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
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
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
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
      },
      {
        field: 'eventOrder',
        headerName: 'Order',
        sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
      },
      {
        field: 'eventID',
        headerName: 'ID',
        sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        },
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
      }
    ];
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

    this.modal.confirm({
       nzTitle: 'Are you sure you want to delete the selected row?',
       nzContent: `${selectedRows[0].eventSetName} will be deleted.`,
       nzOnOk: () => this.delete.emit(selectedRows),
     });
  }
}
