import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { EventSet } from '@shared/api-services/eventSet';
import { GrossLoss } from '@shared/api-services/grossLoss';
import { GrossLossRequest } from '@shared/api-services/grossLossRequest';
import { LossLoad } from '@shared/api-services/lossLoad';
import { LossSet } from '@shared/api-services/lossSet';
import { LossSetRequest } from '@shared/api-services/lossSetRequest';

const uploadFile = createAction('[FileUpload] Upload File', props<{ file: Blob }>());
const uploadFileSuccess = createAction('[FileUpload] Upload File Success', props<{ response: any }>());
const uploadFileFailure = createAction('[FileUpload] Upload File Failure', props<{ error: HttpErrorResponse }>());

const validateFile = createAction('[FileUpload] Validate File', props<{ file: Blob }>());
const validateFileSuccess = createAction('[FileUpload] Validate File Success', props<{ response: any }>());
const validateFileFailure = createAction('[FileUpload] Validate File Failure', props<{ error: HttpErrorResponse }>())

const createGrossLoss = createAction('[GrossLoss] Create', props<{ request: GrossLossRequest }>());
const createGrossLossSuccess = createAction('[GrossLoss] Create Success', props<{ response: GrossLossRequest }>());
const createGrossLossFailure = createAction('[GrossLoss] Create Failure', props<{ error: HttpErrorResponse }>());

const deleteGrossLoss = createAction('[GrossLoss] Delete', props<{ id: number }>());
const deleteGrossLossSuccess = createAction('[GrossLoss] Delete Success', props<{ id: number }>());
const deleteGrossLossFailure = createAction('[GrossLoss] Delete Failure', props<{ error: HttpErrorResponse }>());

const getGrossLossById = createAction('[GrossLoss] Get By Id', props<{ id: number }>());
const getGrossLossByIdSuccess = createAction('[GrossLoss] Get By Id Success', props<{ grossLoss: GrossLoss }>());
const getGrossLossByIdFailure = createAction('[GrossLoss] Get By Id Failure', props<{ error: HttpErrorResponse }>());

const getGrossLossByLossLoadId = createAction('[GrossLoss] Get By LossLoadId', props<{ lossLoadId: number }>());
const getGrossLossByLossLoadIdSuccess = createAction('[GrossLoss] Get By LossLoadId Success', props<{ lossLoads: LossLoad[] }>());
const getGrossLossByLossLoadIdFailure = createAction('[GrossLoss] Get By LossLoadId Failure', props<{ error: HttpErrorResponse }>());

const getGrossLossList = createAction('[GrossLoss] Get List');
const getGrossLossListSuccess = createAction('[GrossLoss] Get List Success', props<{ eventSets: EventSet[] }>());
const getGrossLossListFailure = createAction('[GrossLoss] Get List Failure', props<{ error: HttpErrorResponse }>());

const updateGrossLoss = createAction('[GrossLoss] Update', props<{ request: GrossLossRequest }>());
const updateGrossLossSuccess = createAction('[GrossLoss] Update Success', props<{ response: GrossLossRequest }>());
const updateGrossLossFailure = createAction('[GrossLoss] Update Failure', props<{ error: HttpErrorResponse }>());

const createLossSet = createAction('[LossSet] Create', props<{ request: LossSetRequest }>());
const createLossSetSuccess = createAction('[LossSet] Create Success', props<{ response: LossSetRequest }>());
const createLossSetFailure = createAction('[LossSet] Create Failure', props<{ error: HttpErrorResponse }>());

const deleteLossSet = createAction('[LossSet] Delete', props<{ id: number }>());
const deleteLossSetSuccess = createAction('[LossSet] Delete Success', props<{ id: number }>());
const deleteLossSetFailure = createAction('[LossSet] Delete Failure', props<{ error: HttpErrorResponse }>());

const getLossSetByEventSetId = createAction('[LossSet] Get By EventSetId', props<{ eventSetId: number }>());
const getLossSetByEventSetIdSuccess = createAction('[LossSet] Get By EventSetId Success', props<{ eventSets: EventSet[] }>());
const getLossSetByEventSetIdFailure = createAction('[LossSet] Get By EventSetId Failure', props<{ error: HttpErrorResponse }>());

const getLossSetByEventSetTypeId = createAction('[LossSet] Get By EventSetTypeId', props<{ eventSetTypeId: number }>());
const getLossSetByEventSetTypeIdSuccess = createAction('[LossSet] Get By EventSetTypeId Success', props<{ eventSets: EventSet[] }>());
const getLossSetByEventSetTypeIdFailure = createAction('[LossSet] Get By EventSetTypeId Failure', props<{ error: HttpErrorResponse }>());

const getLossSetFlatList = createAction('[LossSet] Get LossSet Flat List');
const getLossSetFlatListSuccess = createAction('[LossSet] Get LossSet Flat List Success', props<{ lossSetFlatList: any[] }>());
const getLossSetFlatListFailure = createAction('[LossSet] Get LossSet Flat List Failure', props<{ error: HttpErrorResponse }>());

const getLossSetById = createAction('[LossSet] Get By Id', props<{ id: number }>());
const getLossSetByIdSuccess = createAction('[LossSet] Get By Id Success', props<{ lossSet: LossSet }>());
const getLossSetByIdFailure = createAction('[LossSet] Get By Id Failure', props<{ error: HttpErrorResponse }>());

const getLossSetList = createAction('[LossSet] Get List');
const getLossSetListSuccess = createAction('[LossSet] Get List Success', props<{ eventSets: EventSet[] }>());
const getLossSetListFailure = createAction('[LossSet] Get List Failure', props<{ error: HttpErrorResponse }>());

const updateLossSet = createAction('[LossSet] Update', props<{ request: LossSetRequest }>());
const updateLossSetSuccess = createAction('[LossSet] Update Success', props<{ response: LossSetRequest }>());
const updateLossSetFailure = createAction('[LossSet] Update Failure', props<{ error: HttpErrorResponse }>());

const apiLossLoadUploadFilePost = createAction('[LossSet] Upload File Post', props<{ lossLoadID?: number, file?: Blob }>());
const apiLossLoadUploadFilePostSuccess = createAction('[LossSet] Upload File Post Success', props<{ response: any }>());
const apiLossLoadUploadFilePostFailure = createAction('[LossSet] Upload File Post Failure', props<{ error: HttpErrorResponse }>());

export const LossActions = {
    uploadFile,
    uploadFileSuccess,
    uploadFileFailure,

    validateFile,
    validateFileSuccess,
    validateFileFailure,

    createGrossLoss,
    createGrossLossSuccess,
    createGrossLossFailure,

    deleteGrossLoss,
    deleteGrossLossSuccess,
    deleteGrossLossFailure,

    getGrossLossById,
    getGrossLossByIdSuccess,
    getGrossLossByIdFailure,

    getGrossLossByLossLoadId,
    getGrossLossByLossLoadIdSuccess,
    getGrossLossByLossLoadIdFailure,

    getGrossLossList,
    getGrossLossListSuccess,
    getGrossLossListFailure,

    updateGrossLoss,
    updateGrossLossSuccess,
    updateGrossLossFailure,

    createLossSet,
    createLossSetSuccess,
    createLossSetFailure,

    deleteLossSet,
    deleteLossSetSuccess,
    deleteLossSetFailure,

    getLossSetByEventSetId,
    getLossSetByEventSetIdSuccess,
    getLossSetByEventSetIdFailure,

    getLossSetByEventSetTypeId,
    getLossSetByEventSetTypeIdSuccess,
    getLossSetByEventSetTypeIdFailure,

    getLossSetFlatList,
    getLossSetFlatListSuccess,
    getLossSetFlatListFailure, 

    getLossSetById,
    getLossSetByIdSuccess,
    getLossSetByIdFailure,

    getLossSetList,
    getLossSetListSuccess,
    getLossSetListFailure,

    updateLossSet,
    updateLossSetSuccess,
    updateLossSetFailure,

    apiLossLoadUploadFilePost,
    apiLossLoadUploadFilePostSuccess,
    apiLossLoadUploadFilePostFailure
};
