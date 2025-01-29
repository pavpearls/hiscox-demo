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

import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IDetailCellRendererParams,
  ITextFilterParams,
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
  selector: 'app-loss-set-table',
  templateUrl: './loss-set-table.component.html',
  styleUrls: ['./loss-set-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LossSetTableComponent implements OnInit, OnChanges {
  @Input() lossSetData: any[] = [];
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
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lossSetData'] && changes['lossSetData'].currentValue) {
      this.rowData = [...this.lossSetData];
    }
  }

  ngOnInit(): void {
    this.columnDefs = this.getColumns();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    // setTimeout(() => {
    //   this.gridApi.autoSizeAllColumns();
    // });

    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    });
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
        field: 'lossSetID',
        headerName: 'Set ID',
        cellRenderer: 'agGroupCellRenderer',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },

      {
        field: 'lossSetLongName',
        headerName: 'Set Name',
        sortable: true,
        minWidth: 200,
        cellStyle: { fontWeight: 'bold' },
      },
      {
        field: 'asAtDate',
        headerName: 'Reporting Date',
        sortable: true,
        minWidth: 150,
        filter: 'agDateColumnFilter',
        valueFormatter: dateFormatter,
        cellStyle: { fontWeight: 'bold' },
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
      },
      {
        field: 'eventSetName',
        headerName: 'Event Set ',
        sortable: true,
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellStyle: { fontWeight: 'bold' },
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
      },
      
    ];
  }

  getEventResponseDetailColumnDefs(): ColDef[] {
    return [
      {
        field: 'dataSourceName',
        headerName: 'Load Name',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'dataProducer.dataProducerName',
        headerName: 'Data Provider',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'createdBy',
        headerName: 'Upload User',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'loadDate',
        headerName: 'Upload Date',
        sortable: true,
        valueFormatter: dateFormatter,
      },
      {
        field: 'isValid',
        headerName: 'Valid',
        sortable: false
      },
      {
        field: 'totalRecords',
        headerName: 'Total Records',
        sortable: false
      },
      {
        field: 'totalLoss',
        headerName: 'Total Loss',
        sortable: false
      }
    ];
  }

  getDetailColumnDefs(): ColDef[] {
    return [
      {
        field: 'dataSourceName',
        headerName: 'Load Name',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'dataProducer.dataProducerName',
        headerName: 'Data Provider',
        sortable: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'createdBy',
        headerName: 'Upload User',
        sortable: true,
        cellStyle: { 'text-align': 'center' },
      },
      {
        field: 'loadDate',
        headerName: 'Upload Date',
        sortable: true,
        valueFormatter: dateFormatter,
      },
      {
        field: 'isValid',
        headerName: 'Valid',
        sortable: false
      },
      {
        field: 'totalRecords',
        headerName: 'Total Records',
        sortable: false
      },
      {
        field: 'totalLoss',
        headerName: 'Total Loss',
        sortable: false
      }
    ];
  }



  public detailCellRendererParams: any = (masterParams: ICellRendererParams) => {
    const res = {} as IDetailCellRendererParams;

    res.getDetailRowData = (detailParams: any) => {
      const lossLoadCopy = masterParams.data.lossLoads?.map((lossLoad: any) => ({ ...lossLoad })) || [];
      detailParams.successCallback(lossLoadCopy);
    };

    if (masterParams.data.eventTypeID === 3) {
      res.detailGridOptions = {
        columnDefs: this.getEventResponseDetailColumnDefs(),
        defaultColDef: { flex: 1, editable: true },

      };
    } else {
      res.detailGridOptions = {
        columnDefs: this.getDetailColumnDefs(),
        defaultColDef: { flex: 1, editable: true },

      };
    }

    return res;
  };



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
