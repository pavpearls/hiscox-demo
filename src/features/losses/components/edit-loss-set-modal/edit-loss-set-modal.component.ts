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
    /** Controls modal visibility (bound in the parent) */
    @Input() nzVisible = false;
  
    /**
     * If provided, we load an existing LossSet from the store.
     * If null, we can treat this as "new" (optional).
     */
    @Input() lossSetId: number | null = null;
  
    /** Emit an event when user closes (Cancel or after Save) */
    @Output() closed = new EventEmitter<void>();
  
    /**
     * The request object we will update and send to the facade on Save.
     * This holds the top-level fields for the Loss Set.
     */
    lossSetRequest: LossSetRequest = {
      // e.g. lossSetName, lossSetDescription, asAtDate, etc.
    };
  
    /**
     * We’ll use two separate arrays for demonstration:
     * - attachData: "available" loads that user can attach
     * - detachData: "currently attached" loads that user can detach
     */
    attachData: any[] = [];
    detachData: any[] = [];
  
    /** Each tab has its own GridApi */
    private attachGridApi!: GridApi;
    private detachGridApi!: GridApi;
  
    /**
     * Example column definitions for both grids.
     * Adjust or expand as needed.
     */
    columnDefs: ColDef[] = [
      {
        field: 'lossLoadID',
        headerName: 'Load ID',
        checkboxSelection: true
      },
      { field: 'lossLoadName', headerName: 'Loss Name' },
      { field: 'dataSourceName', headerName: 'Data Source' }
      // add more columns as needed, e.g. eventSet, valid, etc.
    ];
  
    private subscriptions: Subscription[] = [];
  
    constructor(private lossFacade: LossFacade) {}
  
    ngOnInit(): void {
      // -----------------------------------------
      // 1) If you have a lossSetId, you can load
      //    it from the store. We'll keep it commented
      //    if focusing on mock data:
      // -----------------------------------------
      if (this.lossSetId) {
        this.lossFacade.actions.lossSets.loadLossSetList();
        this.lossFacade.actions.lossSets.loadLossSetById(this.lossSetId);
  
        const sub = this.lossFacade.state.lossSets.getLossSetById$
          .pipe(filterSuccess())
          .subscribe((res) => {
            if (res.value) {
              const existing: LossSet = res.value;
              // Populate top fields
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
  
              // For demonstration, you might see which members are
              // "attached" vs. "unattached" if you have that logic.
              // We'll just load them all into "detachData" for example:
              if (existing.lossSetLoadMembers) {
                this.detachData = existing.lossSetLoadMembers.map((m) => ({
                  ...m
                }));
              }
            }
          });
        this.subscriptions.push(sub);
      }
  
      // -----------------------------------------
      // 2) For mock data, we can populate attachData & detachData directly:
      //    Suppose we put some rows in each tab for demonstration:
      // -----------------------------------------
      this.attachData = [
        {
          lossLoadID: 1001,
          lossLoadName: 'Mock Load 1001',
          dataSourceName: 'Claims DB'
        },
        {
          lossLoadID: 1002,
          lossLoadName: 'Mock Load 1002',
          dataSourceName: 'Policy DB'
        }
      ];
  
      this.detachData = [
        {
          lossLoadID: 2001,
          lossLoadName: 'Mock Attached 2001',
          dataSourceName: 'UW Estimates'
        },
        {
          lossLoadID: 2002,
          lossLoadName: 'Mock Attached 2002',
          dataSourceName: 'UW Estimates'
        }
      ];
    }
  
    ngOnDestroy(): void {
      // Clean up any subscriptions
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
  
    /** Called when the Attach tab's grid is ready */
    onAttachGridReady(params: GridReadyEvent): void {
      this.attachGridApi = params.api;
      this.attachGridApi.sizeColumnsToFit();
    }
  
    /** Called when the Detach tab's grid is ready */
    onDetachGridReady(params: GridReadyEvent): void {
      this.detachGridApi = params.api;
      this.detachGridApi.sizeColumnsToFit();
    }
  
    /** Example attach method */
    attachSelected(): void {
      if (!this.attachGridApi) return;
      const selectedNodes = this.attachGridApi.getSelectedNodes();
      if (!selectedNodes.length) return;
  
      // For now, just alert how many were selected
      alert(`Attach ${selectedNodes.length} selected row(s).`);
      // Real logic might: move them into "detachData" or update store
    }
  
    /** Example detach method */
    detachSelected(): void {
      if (!this.detachGridApi) return;
      const selectedNodes = this.detachGridApi.getSelectedNodes();
      if (!selectedNodes.length) return;
  
      alert(`Detach ${selectedNodes.length} selected row(s).`);
      // Real logic might: remove them from "detachData" or update store
    }
  
    /** "Save" button in modal’s footer */
    save(): void {
      // You might gather combined data, e.g. what's attached vs. not.
      // Then dispatch updateLossSet(...) to facade, or just close:
      alert(`Saving Loss Set: ${this.lossSetRequest.lossSetName}`);
      this.closed.emit();
    }
  
    /** "Cancel" button in modal’s footer */
    cancel(): void {
      // Just emit the "closed" event so parent can hide the modal
      this.closed.emit();
    }
  }
  