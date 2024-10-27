import { createReducer, on } from '@ngrx/store';
import { RemoteData, notAsked, inProgress, success, failure } from 'ngx-remotedata';
import { loadAnalyses, loadAnalysesSuccess, loadAnalysesFailure } from './analyses.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface AnalysesState {
  analyses: RemoteData<any[], HttpErrorResponse>;
}

export const initialState: AnalysesState = {
  analyses: notAsked()
};

export const analysesReducer = createReducer(
  initialState,
  on(loadAnalyses, (state) => ({
    ...state,
    analyses: inProgress() as any
  })),
  on(loadAnalysesSuccess, (state, { data }) => ({
    ...state,
    analyses: success(data) as any
  })),
  on(loadAnalysesFailure, (state, { error }) => ({
    ...state,
    analyses: failure(error) as any
  }))
);