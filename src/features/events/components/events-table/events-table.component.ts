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
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddEventConfig } from '@events//interfaces/events.interfaces';
import { Event } from '@shared/api-services/models';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ITextFilterParams,
  RowNode,
  RowSelectedEvent,
  RowSelectionOptions,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzModalService],
})
export class EventsTableComponent implements OnInit, OnChanges {
  @Input() set successValue(value: Event[] | undefined) {
    this._successValue = value;
    if (this._successValue) {
      this.inputData = this._successValue.map((event) =>
        this.transformEventDataItem(event)
      );
      if (this.removeRowList && this.removeRowList.length > 0) {
        for (let index = 0; index < this.removeRowList.length; index++) {
          const eventId = this.removeRowList[index].eventID;
          if (eventId) {
            const removeIndex = this.inputData.findIndex(e=>e.eventID == eventId);
            if (removeIndex > -1) {
              this.inputData.splice(removeIndex, 1);
            }
          }
        }
      }
      this.rowData = [...this.inputData];
    }
  }

  @Input({ required: true }) addEventConfig!: AddEventConfig;

  private _successValue: Event[] | undefined = undefined;

  @Input() rowDataList:any[] = [];

  @Input() removeRowList:any[] = [];

  @Input() enableRowSelection = true;
  @Input() enableEditMode = true;
  @Input() isMultipleAddMode = false;

  @Output() edit = new EventEmitter<Event>();
  @Output() copy = new EventEmitter<any[]>();
  @Output() delete = new EventEmitter<any[]>();
  @Output() archive = new EventEmitter<any[]>();
  @Output() selectedRowsChanged = new EventEmitter<any[]>();
  columnDefs: ColDef[] = [];
  inputData: any[] = [];
  rowData: any[] = [];
  editCache: { [key: number]: { edit: boolean; form: FormGroup } } = {};
  public editType: 'fullRow' = 'fullRow';
  private editingRowData: any | null = null;
  private originalRowData: any | null = null;
  private gridApi!: GridApi;

  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'singleRow',
  };
  paginationPageSizeSelector = [10, 25, 50, 100];
  public isEditing = false;
  paginationPageSize = 25;

  public autoSizeStrategy:
  | SizeColumnsToFitGridStrategy
  | SizeColumnsToFitProvidedWidthStrategy
  | SizeColumnsToContentStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
  columnLimits: [],
  };

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addEventConfig']) {
      this.columnDefs = [...this.generateColumns(this.addEventConfig)];

      this.isMultipleAddMode
        ? (this.rowSelection = {
            mode: 'multiRow',
          })
        : (this.rowSelection = {
            mode: 'singleRow',
          });
    }
    if (changes['rowDataList']) {
      this.rowData = this.rowDataList.map((event) =>
        this.transformEventDataItem(event)
      );
    }
  }

  private generateColumns(addEventConfig: AddEventConfig): ColDef[] {
    return [
      {
        field: 'eventID',
        headerName: 'Event ID',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        minWidth: 150,
      },
      {
        field: 'eventTypeName',
        headerName: 'Event Type',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        minWidth: 200,
      },
      {
        field: 'eventNameShort',
        cellStyle: { fontWeight: 'bold' },
        headerName: 'Event Name',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        editable: true,
        minWidth: 200,
      },
      {
        field: 'eventDate',
        headerName: 'Event Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        valueFormatter: (params: any) => {
          return params?.data?.eventDate || '';
        },
        minWidth: 200,
      },
      {
        field: 'regionPerilName',
        headerName: 'Region-Peril',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellRenderer: (params: any) => {
          return params?.data?.regionPerilName ?? null;
        },
        cellEditorParams: {
          values: this.addEventConfig.regionPerilOptions.map(
            (option: any) => option.displayValue
          ),
        },
        minWidth: 200,
      },
      {
        field: 'userName',
        headerName: 'Created By',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        minWidth: 100,
      },
      {
        field: 'createDate',
        headerName: 'Created Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        valueFormatter: (params: any) => {
          return params?.data?.createDate || '';
        },
        minWidth: 200,
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss Estimate',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellRenderer: (params: any) => {
          return params?.data?.industryLossEstimate != null
            ? params.data.industryLossEstimate.toString()
            : '';
        },
        cellEditorParams: {
          values: this.addEventConfig.industryLossOptions.map((option: any) => {
            return option.displayValue.toString();
          }),
        },
        valueFormatter: (params: any) => {
          return params?.value != null ? params.value.toString() : '';
        },
        valueParser: (params: any) => {
          const value = params.newValue;
          return isNaN(Number(value)) ? value : Number(value);
        },
        minWidth: 200,
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Loss Impact Rating',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.addEventConfig.hiscoxImpactOptions.map(
            (option: any) => option.displayValue
          ),
        },
        minWidth: 200,
      },
      {
        field: 'restricted',
        headerName: 'Restricted',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: [true, false],
          valueFormatter: (params: any) => params.value ? 'Yes' : 'No',
          buttons: ['reset', 'apply'],
        },
        cellRenderer: (params: any) => {
          return params.value ? 'Yes' : 'No';
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [true, false],
        },
        editable: true,
        minWidth: 200,
      },
      
      {
        field: 'isArchived',
        headerName: 'Archived',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: [true, false],
          valueFormatter: (params: any) => (params.value ? 'Yes' : 'No'),
          buttons: ['reset', 'apply'],
        },
        cellRenderer: (params: any) => (params.value ? 'Yes' : 'No'),
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [true, false],
        },
        minWidth: 200,
      }
    ];
  }

  private transformEventDataItem(event: Event): any {
    return {
      eventID: event?.eventID || '',
      eventTypeName: event?.eventType?.eventTypeName || '',
      eventNameShort: event?.eventNameShort || '',
      regionPerilName: event?.regionPeril?.regionPerilName || '',
      userName: event?.createdBy || '',
      createDate: event?.createDate
        ? new Date(event?.createDate).toLocaleDateString('en-GB')
        : '',
      eventDate: event?.eventDate
        ? new Date(event?.eventDate).toLocaleDateString('en-GB')
        : '',
      industryLossEstimate: event?.industryLossEstimate || '',
      hiscoxLossImpactRating: event?.hiscoxLossImpactRating || '',
      isRestrictedAccess: event?.isRestrictedAccess ?? false,
      isArchived: event?.isArchived ?? false
    };
  }

  onSaveClick(eventID: number): void {
    if (!this.editingRowData || this.editingRowData.eventID !== eventID) {
      this.notification.error('Error', 'No row is currently being edited.');
      return;
    }

    this.edit.emit(this.editingRowData);
    this.editingRowData = null;
    this.originalRowData = null;
    this.gridApi.refreshCells();
    this.notification.success(
      'Success',
      `Changes to Event ID ${eventID} saved.`
    );
  }

  onCancelClick(eventID: number): void {
    if (!this.originalRowData) {
      this.notification.error('Error', 'No changes to cancel.');
      return;
    }

    const selectedNode = this.gridApi.getRowNode(eventID.toString());
    if (selectedNode) {
      selectedNode.setData(this.originalRowData);
    }

    this.editingRowData = null;
    this.originalRowData = null;
    this.notification.info(
      'Cancelled',
      `Changes to Event ID ${eventID} reverted.`
    );
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  
    setTimeout(() => {
      this.gridApi.autoSizeAllColumns();
    });
  
    const defaultFilterModel = {
      isArchived: {
        filterType: 'set',
        values: [false],
      },
    };
    this.gridApi.setFilterModel(defaultFilterModel);
  }

  getRowId = (params: any) => params.data.eventID.toString();

  onCopyClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.modal.warning({
        nzTitle: 'No Rows Selected',
        nzContent: 'Please select rows to copy.',
      });
      return;
    }

    this.modal.confirm({
      nzTitle: 'Are you sure you want to copy the selected rows?',
      nzContent: `${selectedRows.length} rows will be copied.`,
      nzOnOk: () => this.copy.emit(selectedRows),
    });
  }

  onArchiveClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.modal.warning({
        nzTitle: 'No Rows Selected',
        nzContent: 'Please select rows to archive.',
      });
      return;
    }

    this.modal.confirm({
      nzTitle: 'Are you sure you want to archive the selected rows?',
      nzContent: `${selectedRows.length} rows will be archived.`,
      nzOnOk: () => this.archive.emit(selectedRows),
    });
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

    // this.modal.confirm({
    //   nzTitle: 'Are you sure you want to delete the selected rows?',
    //   nzContent: `${selectedRows.length} rows will be deleted.`,
    //   nzOnOk: () => this.delete.emit(selectedRows),
    // });
  }

  onEditClick(): void {
    if (this.isEditing) {
      this.saveEdit();
    } else {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) {
        this.modal.warning({
          nzTitle: 'No Row Selected',
          nzContent: 'Please select a row to edit.',
        });
        return;
      }

      if (selectedNodes.length > 1) {
        this.modal.warning({
          nzTitle: 'Too Many Rows Selected',
          nzContent: 'Please select a single row you wish to edit.',
        });
        return;
      }

      const selectedNode = selectedNodes[0];
      this.startEditingRow(selectedNode as any);
    }
    this.isEditing = !this.isEditing;
  }

  startEditingRow(rowNode: RowNode): void {
    if (this.gridApi) {
      this.gridApi.startEditingCell({
        rowIndex: rowNode.rowIndex!,
        colKey: this.columnDefs.find((col) => col.editable)?.field as any,
      });
    }
  }

  saveEdit(): void {
    if (this.gridApi) {
      this.gridApi.stopEditing();
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length > 0) {
        this.edit.emit(selectedRows[0]);
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.gridApi) {
      this.gridApi.stopEditing(true);
    }
  }

  stopEditing(): void {
    if (this.gridApi) {
      this.gridApi.stopEditing();
    }
  }

  onRowSelected(event: RowSelectedEvent): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedRowsChanged.emit(selectedRows);
  }

  onCellDoubleClicked(event: any): void {
    const node = event.api.getDisplayedRowAtIndex(event.rowIndex);
    node.setSelected(true);
    this.startEditingRow(node as any);
    this.isEditing = true;
  }
}
