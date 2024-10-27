import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAnalyses } from './analyses.actions';
import { selectAnalyses } from './analyses.selectors';

@Injectable()
export class AnalysesFacade {
  constructor(private store: Store<any>) {}

  analyses$ = this.store.select(selectAnalyses);

  loadAnalyses() {
    this.store.dispatch(loadAnalyses());
  }
}