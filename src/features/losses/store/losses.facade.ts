import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { LossSelectors } from "./losses.selectors";
import { LossState } from "./losses.reducer";
import { LossActions } from "./losses.actions";
import { GrossLossRequest, LossSetRequest } from "@shared/api-services/models";
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, map } from 'rxjs';
import { isInProgress } from 'ngx-remotedata';

@Injectable({ providedIn: 'root' })
export class LossFacade {
    constructor(private store: Store<LossState>, private spinner: NgxSpinnerService) {}

    state = {
        fileUpload: {
            uploadFile$: this.store.pipe(select(LossSelectors.selectUploadFile)),
            validateFile$: this.store.pipe(select(LossSelectors.selectValidateFile)),
        },
        grossLoss: {
            createGrossLoss$: this.store.pipe(select(LossSelectors.selectCreateGrossLoss)),
            deleteGrossLoss$: this.store.pipe(select(LossSelectors.selectDeleteGrossLoss)),
            getGrossLossById$: this.store.pipe(select(LossSelectors.selectGetGrossLossById)),
            getGrossLossByLossLoadId$: this.store.pipe(select(LossSelectors.selectGetGrossLossByLossLoadId)),
            getGrossLossList$: this.store.pipe(select(LossSelectors.selectGetGrossLossList)),
            updateGrossLoss$: this.store.pipe(select(LossSelectors.selectUpdateGrossLoss)),
        },
        lossSets: {
            createLossSet$: this.store.pipe(select(LossSelectors.selectCreateLossSet)),
            deleteLossSet$: this.store.pipe(select(LossSelectors.selectDeleteLossSet)),
            getLossSetByEventSetId$: this.store.pipe(select(LossSelectors.selectGetLossSetByEventSetId)),
            getLossSetByEventSetTypeId$: this.store.pipe(select(LossSelectors.selectGetLossSetByEventSetTypeId)),
            getLossSetById$: this.store.pipe(select(LossSelectors.selectGetLossSetById)),
            getLossSetList$: this.store.pipe(select(LossSelectors.selectGetLossSetList)),
            updateLossSet$: this.store.pipe(select(LossSelectors.selectUpdateLossSet)),
        },
    };

    actions = {
        fileUpload: {
            uploadFile: (file: Blob): void => {
                this.store.dispatch(LossActions.uploadFile({ file }));
            },
            validateFile: (file: Blob): void => {
                this.store.dispatch(LossActions.validateFile({ file }));
            },
        },
        grossLoss: {
            createGrossLoss: (request: GrossLossRequest): void => {
                this.store.dispatch(LossActions.createGrossLoss({ request }));
            },
            deleteGrossLoss: (id: number): void => {
                this.store.dispatch(LossActions.deleteGrossLoss({ id }));
            },
            loadGrossLossById: (id: number): void => {
                this.store.dispatch(LossActions.getGrossLossById({ id }));
            },
            loadGrossLossByLossLoadId: (lossLoadId: number): void => {
                this.store.dispatch(LossActions.getGrossLossByLossLoadId({ lossLoadId }));
            },
            loadGrossLossList: (): void => {
                this.store.dispatch(LossActions.getGrossLossList());
            },
            updateGrossLoss: (request: GrossLossRequest): void => {
                this.store.dispatch(LossActions.updateGrossLoss({ request }));
            },
        },
        lossSets: {
            createLossSet: (request: LossSetRequest): void => {
                this.store.dispatch(LossActions.createLossSet({ request }));
            },
            deleteLossSet: (id: number): void => {
                this.store.dispatch(LossActions.deleteLossSet({ id }));
            },
            loadLossSetByEventSetId: (eventSetId: number): void => {
                this.store.dispatch(LossActions.getLossSetByEventSetId({ eventSetId }));
            },
            loadLossSetByEventSetTypeId: (eventSetTypeId: number): void => {
                this.store.dispatch(LossActions.getLossSetByEventSetTypeId({ eventSetTypeId }));
            },
            loadLossSetById: (id: number): void => {
                this.store.dispatch(LossActions.getLossSetById({ id }));
            },
            loadLossSetList: (): void => {
                this.store.dispatch(LossActions.getLossSetList());
            },
            updateLossSet: (request: LossSetRequest): void => {
                this.store.dispatch(LossActions.updateLossSet({ request }));
            },
        },
    };

    showLoadingSpinnerForApiResponses(...observables: any[]): void {
        combineLatest(observables)
            .pipe(map(states => states.some(isInProgress)))
            .subscribe(showSpinner => {
                if (showSpinner) {
                    this.spinner.show();
                } else {
                    this.spinner.hide();
                }
            });
    }
}
