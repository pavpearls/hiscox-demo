import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, takeWhile } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { isInProgress, RemoteData } from 'ngx-remotedata';
import { EventsState } from './events.reducer';
import { EventsSelectors } from './events.selectors';
import { EventsActions } from './events.actions';

@Injectable({
  providedIn: 'root',
})
export class EventsFacade {
  // Observables for each state slice
  eventsTypeList$: Observable<RemoteData<any[], HttpErrorResponse>> = this.store.pipe(
    select(EventsSelectors.selectEventTypeList)
  );
  regionPerilList$: Observable<RemoteData<any[], HttpErrorResponse>> = this.store.pipe(
    select(EventsSelectors.selectRegionPerilList)
  );
  eventsByEventType$: Observable<RemoteData<any[], HttpErrorResponse>> = this.store.pipe(
    select(EventsSelectors.selectEventsByEventType)
  );
  addEvent$: Observable<RemoteData<any, HttpErrorResponse>> = this.store.pipe(
    select(EventsSelectors.selectAddEvent)
  );


  constructor(private store: Store<EventsState>,  private spinner: NgxSpinnerService) {}

  // Dispatch actions
  loadEventTypeList(): void {
    this.store.dispatch(EventsActions.EventsSharedActions.getEventTypeList());
  }

  loadRegionPerilList(): void {
    this.store.dispatch(EventsActions.EventsSharedActions.getRegionPerilList());
  }

  loadEventsByEventType(payload: any): void {
    this.store.dispatch(EventsActions.EventsSharedActions.getEventsByEventType({ payload }));
  }

  addNewEvent(payload: any): void {
    this.store.dispatch(EventsActions.EventsSharedActions.addNewEvent({ payload }));
  }

  showLoadingSpinnerForApiResponses<T>(observables: Observable<RemoteData<T, HttpErrorResponse>>[], isComponentAlive: boolean): void {
    combineLatest(observables)
      .pipe(takeWhile(() => isComponentAlive))
      .subscribe(responses => {
        if (responses.some(response => isInProgress(response))) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      });
  }
}
