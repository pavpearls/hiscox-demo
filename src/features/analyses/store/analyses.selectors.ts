import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalysesState } from './analyses.reducer';

export const selectAnalysesState = createFeatureSelector<AnalysesState>('analyses');

export const selectAnalyses = createSelector(
  selectAnalysesState,
  (state: AnalysesState) => state.analyses
);