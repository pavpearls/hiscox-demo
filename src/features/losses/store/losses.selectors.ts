import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LossState } from "./losses.reducer";

const selectLossFeature = createFeatureSelector<LossState>('loss');

 const selectUploadFile = createSelector(selectLossFeature, state => state.uploadFile);
 const selectValidateFile = createSelector(selectLossFeature, state => state.validateFile);

 const selectCreateGrossLoss = createSelector(selectLossFeature, state => state.createGrossLoss);
 const selectDeleteGrossLoss = createSelector(selectLossFeature, state => state.deleteGrossLoss);
 const selectGetGrossLossById = createSelector(selectLossFeature, state => state.getGrossLossById);
 const selectGetGrossLossByLossLoadId = createSelector(selectLossFeature, state => state.getGrossLossByLossLoadId);
 const selectGetGrossLossList = createSelector(selectLossFeature, state => state.getGrossLossList);
 const selectUpdateGrossLoss = createSelector(selectLossFeature, state => state.updateGrossLoss);

 const selectCreateLossSet = createSelector(selectLossFeature, state => state.createLossSet);
 const selectDeleteLossSet = createSelector(selectLossFeature, state => state.deleteLossSet);
 const selectGetLossSetByEventSetId = createSelector(selectLossFeature, state => state.getLossSetByEventSetId);
 const selectGetLossSetByEventSetTypeId = createSelector(selectLossFeature, state => state.getLossSetByEventSetTypeId);
 const selectGetLossSetById = createSelector(selectLossFeature, state => state.getLossSetById);
 const selectGetLossSetList = createSelector(selectLossFeature, state => state.getLossSetList);
 const selectUpdateLossSet = createSelector(selectLossFeature, state => state.updateLossSet); 
 const apiLossLoadUploadFilePost = createSelector(selectLossFeature, state => state.apiLossLoadUploadFilePost);

export const LossSelectors = {
    selectUploadFile,
    selectValidateFile,

    selectCreateGrossLoss,
    selectDeleteGrossLoss,
    selectGetGrossLossById,
    selectGetGrossLossByLossLoadId,
    selectGetGrossLossList,
    selectUpdateGrossLoss,
  
    selectCreateLossSet,
    selectDeleteLossSet,
    selectGetLossSetByEventSetId,
    selectGetLossSetByEventSetTypeId,
    selectGetLossSetById,
    selectGetLossSetList,
    selectUpdateLossSet,
    apiLossLoadUploadFilePost
  };