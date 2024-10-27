import { createAction, props } from '@ngrx/store';

export const loadAnalyses = createAction('[Analyses] Load Analyses');
export const loadAnalysesSuccess = createAction(
  '[Analyses] Load Analyses Success',
  props<{ data: any[] }>()
);
export const loadAnalysesFailure = createAction(
  '[Analyses] Load Analyses Failure',
  props<{ error: string }>()
);