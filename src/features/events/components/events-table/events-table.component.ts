import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventsFacade } from '@events//store/events.facade';
import { Event } from '@shared/api-services/models';
import { ColDef, GridApi, GridReadyEvent, RowNode, RowSelectionOptions } from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzModalService],
})
export class EventsTableComponent implements OnInit {
  @Input() set successValue(value: Event[] | undefined) {
    this._successValue = value;
    if (this._successValue) {
      this.rowData = this._successValue.map(event => this.transformEventDataItem(event));
      this.initializeEditCache();
    }
  }

  private _successValue: Event[] | undefined = undefined;

  @Input() enableRowSelection = true;
  @Input() enableEditMode = true;

  @Output() edit = new EventEmitter<Event>();
  @Output() copy = new EventEmitter<any[]>();
  @Output() delete = new EventEmitter<any[]>();
  @Output() archive = new EventEmitter<any[]>();

  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  editCache: { [key: number]: { edit: boolean; form: FormGroup } } = {};
  public editType: "fullRow" = "fullRow";
  private editingRowData: any | null = null;
  private originalRowData: any | null = null;
  private gridApi!: GridApi;

  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'singleRow',
  };

  public isEditing = false;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private eventFacade: EventsFacade
  ) { }

  ngOnInit(): void {
    this.columnDefs = this.generateColumns();
  }

  private initializeEditCache(): void {
    this.rowData.forEach(item => {
      this.editCache[item.eventID] = {
        edit: false,
        form: this.fb.group({
          eventNameShort: [item.eventNameShort],
          eventTypeName: [item.eventTypeName],
        }),
      };
    });
  }

  private generateColumns(): ColDef[] {
    return [
      { field: 'eventID', headerName: 'Event ID', sortable: true, filter: 'agNumberColumnFilter' },
      { field: 'eventTypeName', headerName: 'Event Type', sortable: true, filter: 'agTextColumnFilter' },
      { field: 'eventNameShort', headerName: 'Event Name', sortable: true, filter: 'agTextColumnFilter', editable: true },
      { field: 'regionPerilName', headerName: 'Region-Peril', sortable: true, filter: 'agTextColumnFilter', editable: true },
      { field: 'userName', headerName: 'Created By', sortable: true, filter: 'agTextColumnFilter' },
      {
        field: 'createDate',
        headerName: 'Created Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        valueFormatter: (params: any) => params.value || '',
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss Estimate',
        sortable: true,
        filter: 'agNumberColumnFilter',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellRenderer: (params: any) => {
          return params?.data?.industryLossEstimate ?? null
        },
        cellEditorParams: { values: ['10', '20', '30', '40', '50'] },
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Loss Impact Rating',
        sortable: true,
        filter: 'agTextColumnFilter',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['HIGH', 'MEDIUM', 'LOW'] },
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss Estimate',
        sortable: true,
        filter: 'agNumberColumnFilter',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['10', '20', '30', '40', '50'] },
      },
      {
        field: 'hiscoxLossImpactRating',
        headerName: 'Hiscox Loss Impact Rating',
        sortable: true,
        filter: 'agTextColumnFilter',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['HIGH', 'MEDIUM', 'LOW'] },
      },
      {
        field: 'restricted',
        headerName: 'Restricted',
        filter: true,
        cellRenderer: (params: any) => {
          return params?.data?.isRestrictedAccess === true ? 'Yes' : 'No'
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: true,
      },
      {
        field: 'archived',
        headerName: 'Archived',
        filter: true,
        cellRenderer: (params: any) => (params?.data?.isArchived === true ? 'Yes' : 'No'),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: true,
      },
    ];
  }

  private transformEventDataItem(event: Event): any {
    return {
      eventID: event?.eventID || '',
      eventTypeName: event?.eventType?.eventTypeName || '',
      eventNameShort: event?.eventNameShort || '',
      regionPerilName: event?.regionPeril?.regionPerilName || '',
      userName: event?.createUser?.userName || '',
      createDate: event?.createDate ? new Date(event?.createDate).toLocaleDateString('en-GB') : '',
      industryLossEstimate: event?.industryLossEstimate || '',
      hiscoxLossImpactRating: event?.hiscoxLossImpactRating || '',
      isRestrictedAccess: event?.isRestrictedAccess || false,
      isArchived: event?.isArchived || false,
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
    this.notification.success('Success', `Changes to Event ID ${eventID} saved.`);
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
    this.notification.info('Cancelled', `Changes to Event ID ${eventID} reverted.`);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
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

    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete the selected rows?',
      nzContent: `${selectedRows.length} rows will be deleted.`,
      nzOnOk: () => this.delete.emit(selectedRows),
    });
  }

  onEditClick(): void {
    if (this.isEditing) {
      this.saveEdit(); // Save changes
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
        colKey: this.columnDefs.find(col => col.editable)?.field as any, // Start editing from the first editable column
      });
    }
  }

  saveEdit(): void {
    if (this.gridApi) {
      this.gridApi.stopEditing();
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length > 0) {
        this.edit.emit(selectedRows[0])
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
}
