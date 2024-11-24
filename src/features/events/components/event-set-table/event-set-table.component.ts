import { ChangeDetectionStrategy, Component, EventEmitter, Input, input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent, ICellRendererParams, IDetailCellRendererParams, IGroupCellRendererParams, RowGroupingDisplayType, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy } from 'ag-grid-enterprise';
import moment from 'moment';

@Component({
  selector: 'app-event-set-table',
  templateUrl: './event-set-table.component.html',
  styleUrl: './event-set-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSetTableComponent implements OnInit, OnChanges {
  @Input() eventSetData: any[];
  @Output() new = new EventEmitter<Event>();

  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1 };
  public rowData!: any[];
  public detailRowHeight = 195;
  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
      type: "fitCellContents",
    };

  public detailCellRendererParams: any = (params: ICellRendererParams) => {
    var res = {} as IDetailCellRendererParams;

    res.getDetailRowData = function (params: any) {
      params.successCallback(params.data.events);
    };
    res.detailGridOptions = {
      columnDefs: this.getDetailColumnDefs(),
      defaultColDef: {
        flex: 1,
      },
    };

    return res;
  };

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
        field: 'createDate', headerName: 'Create Date', sortable: true, cellRenderer: "agGroupCellRenderer",
        cellRendererParams: {
          innerRenderer: (data: any) => {
            return data.value ? moment(data.value).format('DD/MM/YYYY') : '';
          }
        } as IGroupCellRendererParams,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }

      },
      {
        field: 'eventSetID', headerName: 'Set ID', sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }
      },
      { field: 'eventSetName', headerName: 'Event Set Name', sortable: true },
      { field: 'createUser.userName', headerName: 'Create User', sortable: true },

    ];
  }

  getDetailColumnDefs(): ColDef[] {
    return [
      {
        field: 'simYear', headerName: 'Sim Year', sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }
      },
      {
        field: 'eventOrder', headerName: 'Order', sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }
      },
      {
        field: 'eventID', headerName: 'ID', sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }
      },
      { field: 'eventType.eventTypeName', headerName: 'Event Type', sortable: true },
      { field: 'eventNameShort', headerName: 'Event Name', sortable: true },
      {
        field: 'eventDate', headerName: 'Event Date', sortable: true,
        cellRenderer: (data: any) => {
          return data.value ? moment(data.value).format('DD/MM/YYYY') : '';
        }
      },
      { field: 'regionPeril.regionPerilName', headerName: 'Region Peril', sortable: true },
      {
        field: 'industryLossEstimate', headerName: 'Industry Loss', sortable: true,
        cellStyle: () => {
          return { 'text-align': 'center' };
        }
      },
      { field: 'hiscoxLossImpactRating', headerName: 'Hiscox Impact', sortable: true }
    ]
  }
}
