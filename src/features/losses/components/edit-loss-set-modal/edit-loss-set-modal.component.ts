import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    OnDestroy
  } from '@angular/core';
  import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-enterprise';
  import { LossFacade } from 'features/losses/store/losses.facade';
  import {
    LossSet,
    LossSetRequest,
    LossSetLoadMember,
  } from '@shared/api-services/models';
  import { Subscription } from 'rxjs';
import { filterSuccess } from 'ngx-remotedata';
  
  @Component({
    selector: 'app-edit-loss-set-modal',
    templateUrl: './edit-loss-set-modal.component.html',
    styleUrls: ['./edit-loss-set-modal.component.scss']
  })
  export class EditLossSetModalComponent implements OnInit, OnDestroy {
    /** Controls modal visibility */
    @Input() nzVisible = false;
  
    /**
     * If provided, we load an existing LossSet from the store.
     * If null, we can treat this as "new" (optional).
     */
    @Input() lossSetId: number | null = null;
  
    /** Emit an event if the user clicks Cancel or after we save successfully */
    @Output() closed = new EventEmitter<void>();
  
    /** The request object we will update and send to the facade on Save */
    lossSetRequest: LossSetRequest = {
      // Fields like lossSetName, lossSetDescription, etc.
    };
  
    /** Table setup */
    columnDefs: ColDef[] = [
      { field: 'lossLoadID', headerName: 'Load ID', checkboxSelection: true },
      { field: 'lossLoadName', headerName: 'Loss Name' },
      { field: 'dataSourceName', headerName: 'Data Source' },
      // add more columns as needed
    ];
    rowData: Partial<LossSetLoadMember>[] = [];
  
    private gridApi!: GridApi;
    private subscriptions: Subscription[] = [];
  
    constructor(private lossFacade: LossFacade) {}
  
    ngOnInit(): void {
      if (this.lossSetId) {
        // 1) Dispatch an action to load the existing Loss Set by ID
        this.lossFacade.actions.lossSets.loadLossSetList();

        
        this.lossFacade.actions.lossSets.loadLossSetById(this.lossSetId);
  
        // 2) Subscribe to the result
        const sub = this.lossFacade.state.lossSets.getLossSetById$
        .pipe(filterSuccess())
        .subscribe(res => {
          if (res.value) {
            const existing: LossSet = res.value;
            // Populate our request object from the existing LossSet
            this.lossSetRequest = {
              lossSetID: existing.lossSetID,
              lossSetName: existing.lossSetName ?? '',
              lossSetDescription: existing.lossSetDescription ?? '',
              asAtDate: existing.asAtDate,
              versionNum: existing.versionNum,
              isArchived: existing.isArchived,
              isLocked: existing.isLocked,
              isApproved: existing.isApproved,
              approvedComments: existing.approvedComments
            };
            // Put the existing members into rowData for the grid
            if (existing.lossSetLoadMembers) {
              this.rowData = existing.lossSetLoadMembers.map(m => ({
                ...m
                // e.g. lossLoadID, dataSourceName, etc.
              }));
            }
          }
        });
        this.subscriptions.push(sub);
      } else {
        // Possibly new Loss Set scenario, rowData = []
        this.rowData = [];
      }
    }
  
    ngOnDestroy(): void {
      // Clean up subscriptions
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  
    onGridReady(params: GridReadyEvent): void {
      this.gridApi = params.api;
    }
  
    /** Called by the "Add Loss" button */
    addLoss(): void {
      // You could open another modal to pick from available loads
      // For simplicity, we'll just push a dummy row:
      const newMember: Partial<LossSetLoadMember> = {
        lossLoadID: Date.now(), // Dummy ID or 0 if new
      };
      // Insert into rowData
      this.rowData = [...this.rowData, newMember];
      // Optionally refresh the grid
    //   this.gridApi.setRow(this.rowData);
    }
  
    /** Called by the "Remove Loss" button */
    removeLoss(): void {
      // Get selected rows from the grid
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) return;
  
      // Filter them out of rowData
      const selectedData = selectedNodes.map(node => node.data);
      this.rowData = this.rowData.filter(item => !selectedData.includes(item));
    //   this.gridApi.setRowData(this.rowData);
    }
  
    /** "OK" button in the modal’s footer */
    save(): void {
      // Build final request
      // 1) Copy or merge the rowData as `lossSetLoadMembers` into lossSetRequest
    //   this.lossSetRequest.lossSetLoadMembers = this.rowData.map((row) => ({
    //     // Convert partial row to the real model fields
    //     lossLoadID: row.lossLoadID,
    //     // ...
    //   })) as LossSetLoadMember[];
  
      // 2) Dispatch updateLossSet to facade
      this.lossFacade.actions.lossSets.updateLossSet(this.lossSetRequest);
  
      // 3) Optionally close the modal or wait for success
      this.closed.emit();
    }
  
    /** "Cancel" button in the modal’s footer */
    cancel(): void {
      // Just close without saving
      this.closed.emit();
    }
  }
  