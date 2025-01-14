import { createReducer, on } from '@ngrx/store';
import { RemoteData, notAsked, inProgress, success, failure } from 'ngx-remotedata';
import { HttpErrorResponse } from '@angular/common/http';
import { GrossLossRequest } from '@shared/api-services/grossLossRequest';
import { GrossLoss } from '@shared/api-services/grossLoss';
import { LossLoad } from '@shared/api-services/lossLoad';
import { EventSet } from '@shared/api-services/eventSet';
import { LossActions } from './losses.actions';
import { LossSetRequest } from '@shared/api-services/lossSetRequest';
import { LossSet } from '@shared/api-services/lossSet';

export interface LossState {
    uploadFile: RemoteData<any, HttpErrorResponse>;
    validateFile: RemoteData<any, HttpErrorResponse>;
  
    createGrossLoss: RemoteData<GrossLossRequest, HttpErrorResponse>;
    deleteGrossLoss: RemoteData<number, HttpErrorResponse>;
    getGrossLossById: RemoteData<GrossLoss, HttpErrorResponse>;
    getGrossLossByLossLoadId: RemoteData<LossLoad[], HttpErrorResponse>;
    getGrossLossList: RemoteData<EventSet[], HttpErrorResponse>;
    updateGrossLoss: RemoteData<GrossLossRequest, HttpErrorResponse>;
  
    createLossSet: RemoteData<LossSetRequest, HttpErrorResponse>;
    deleteLossSet: RemoteData<number, HttpErrorResponse>;
    getLossSetByEventSetId: RemoteData<EventSet[], HttpErrorResponse>;
    getLossSetByEventSetTypeId: RemoteData<EventSet[], HttpErrorResponse>;
    getLossSetById: RemoteData<LossSet, HttpErrorResponse>;
    getLossSetList: RemoteData<EventSet[], HttpErrorResponse>;
    updateLossSet: RemoteData<LossSetRequest, HttpErrorResponse>;
    apiLossLoadUploadFilePost: RemoteData<any, HttpErrorResponse>;
  }
  

const initialState: LossState = {
    uploadFile: notAsked(),
    validateFile: notAsked(),
  
    createGrossLoss: notAsked(),
    deleteGrossLoss: notAsked(),
    getGrossLossById: notAsked(),
    getGrossLossByLossLoadId: notAsked(),
    getGrossLossList: notAsked(),
    updateGrossLoss: notAsked(),
  
    createLossSet: notAsked(),
    deleteLossSet: notAsked(),
    getLossSetByEventSetId: notAsked(),
    getLossSetByEventSetTypeId: notAsked(),
    getLossSetById: notAsked(),
    getLossSetList: notAsked(),
    updateLossSet: notAsked(),
    apiLossLoadUploadFilePost: notAsked()
};

export const lossReducer = createReducer(
    initialState,
    
    on(LossActions.uploadFile, (state) => ({ ...state, uploadFile: inProgress() as any })),
    on(LossActions.uploadFileSuccess, (state, { response }) => ({ ...state, uploadFile: success(response) as any })),
    on(LossActions.uploadFileFailure, (state, { error }) => ({ ...state, uploadFile: failure(error) })),
  
    on(LossActions.validateFile, (state) => ({ ...state, validateFile: inProgress() as any })),
    on(LossActions.validateFileSuccess, (state, { response }) => ({ ...state, validateFile: success(response) as any })),
    on(LossActions.validateFileFailure, (state, { error }) => ({ ...state, validateFile: failure(error) as any })),
  
    on(LossActions.createGrossLoss, (state) => ({ ...state, createGrossLoss: inProgress() as any })),
    on(LossActions.createGrossLossSuccess, (state, { response }) => ({ ...state, createGrossLoss: success(response) as any })),
    on(LossActions.createGrossLossFailure, (state, { error }) => ({ ...state, createGrossLoss: failure(error) as any })),
  
    on(LossActions.deleteGrossLoss, (state) => ({ ...state, deleteGrossLoss: inProgress() as any })),
    on(LossActions.deleteGrossLossSuccess, (state, { id }) => ({ ...state, deleteGrossLoss: success(id) as any })),
    on(LossActions.deleteGrossLossFailure, (state, { error }) => ({ ...state, deleteGrossLoss: failure(error) as any })),
  
    on(LossActions.getGrossLossById, (state) => ({ ...state, getGrossLossById: inProgress() as any })),
    on(LossActions.getGrossLossByIdSuccess, (state, { grossLoss }) => ({ ...state, getGrossLossById: success(grossLoss) as any })),
    on(LossActions.getGrossLossByIdFailure, (state, { error }) => ({ ...state, getGrossLossById: failure(error) as any })),
  
    on(LossActions.getGrossLossByLossLoadId, (state) => ({ ...state, getGrossLossByLossLoadId: inProgress() as any })),
    on(LossActions.getGrossLossByLossLoadIdSuccess, (state, { lossLoads }) => ({ ...state, getGrossLossByLossLoadId: success(lossLoads) as any })),
    on(LossActions.getGrossLossByLossLoadIdFailure, (state, { error }) => ({ ...state, getGrossLossByLossLoadId: failure(error) as any })),
  
    on(LossActions.getGrossLossList, (state) => ({ ...state, getGrossLossList: inProgress() as any })),
    on(LossActions.getGrossLossListSuccess, (state, { eventSets }) => ({ ...state, getGrossLossList: success(eventSets) as any })),
    on(LossActions.getGrossLossListFailure, (state, { error }) => ({ ...state, getGrossLossList: failure(error) as any })),
  
    on(LossActions.updateGrossLoss, (state) => ({ ...state, updateGrossLoss: inProgress() as any })),
    on(LossActions.updateGrossLossSuccess, (state, { response }) => ({ ...state, updateGrossLoss: success(response) as any })),
    on(LossActions.updateGrossLossFailure, (state, { error }) => ({ ...state, updateGrossLoss: failure(error) as any })),
  
    on(LossActions.createLossSet, (state) => ({ ...state, createLossSet: inProgress() as any })),
    on(LossActions.createLossSetSuccess, (state, { response }) => ({ ...state, createLossSet: success(response) as any })),
    on(LossActions.createLossSetFailure, (state, { error }) => ({ ...state, createLossSet: failure(error) as any })),
  
    on(LossActions.deleteLossSet, (state) => ({ ...state, deleteLossSet: inProgress() as any })),
    on(LossActions.deleteLossSetSuccess, (state, { id }) => ({ ...state, deleteLossSet: success(id) as any })),
    on(LossActions.deleteLossSetFailure, (state, { error }) => ({ ...state, deleteLossSet: failure(error) as any })),
  
    on(LossActions.getLossSetByEventSetId, (state) => ({ ...state, getLossSetByEventSetId: inProgress() as any })),
    on(LossActions.getLossSetByEventSetIdSuccess, (state, { eventSets }) => ({ ...state, getLossSetByEventSetId: success(eventSets) as any })),
    on(LossActions.getLossSetByEventSetIdFailure, (state, { error }) => ({ ...state, getLossSetByEventSetId: failure(error) as any })),
  
    on(LossActions.getLossSetByEventSetTypeId, (state) => ({ ...state, getLossSetByEventSetTypeId: inProgress() as any })),
    on(LossActions.getLossSetByEventSetTypeIdSuccess, (state, { eventSets }) => ({ ...state, getLossSetByEventSetTypeId: success(eventSets) as any })),
    on(LossActions.getLossSetByEventSetTypeIdFailure, (state, { error }) => ({ ...state, getLossSetByEventSetTypeId: failure(error) as any })),
  
    on(LossActions.getLossSetById, (state) => ({ ...state, getLossSetById: inProgress() as any })),
    on(LossActions.getLossSetByIdSuccess, (state, { lossSet }) => ({ ...state, getLossSetById: success(lossSet) as any })),
    on(LossActions.getLossSetByIdFailure, (state, { error }) => ({ ...state, getLossSetById: failure(error) as any })),
  
    on(LossActions.getLossSetList, (state) => ({ ...state, getLossSetList: inProgress() as any })),
    on(LossActions.getLossSetListSuccess, (state, { eventSets }) => ({ ...state, getLossSetList: success(eventSets) as any })),
    on(LossActions.getLossSetListFailure, (state, { error }) => ({ ...state, getLossSetList: failure(error) as any })),
  
    on(LossActions.updateLossSet, (state) => ({ ...state, updateLossSet: inProgress() as any })),
    on(LossActions.updateLossSetSuccess, (state, { response }) => ({ ...state, updateLossSet: success(response) as any })),
    on(LossActions.updateLossSetFailure, (state, { error }) => ({ ...state, updateLossSet: failure(error) as any })),

    on(LossActions.apiLossLoadUploadFilePost, (state) => ({ ...state, apiLossLoadUploadFilePost: inProgress() as any })),
    on(LossActions.apiLossLoadUploadFilePostSuccess, (state, { response }) => ({ ...state, apiLossLoadUploadFilePost: success(response) as any })),
    on(LossActions.apiLossLoadUploadFilePostFailure, (state, { error }) => ({ ...state, apiLossLoadUploadFilePost: failure(error) as any }))
  
  );
  
  