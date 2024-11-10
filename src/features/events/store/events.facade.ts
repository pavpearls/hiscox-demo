import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isInProgress, RemoteData } from 'ngx-remotedata';
import { combineLatest, Observable, takeWhile } from 'rxjs';
import { EventsActions } from './events.actions';
import { EventsState } from './events.reducer';
import { EventsSelectors } from './events.selectors';

@Injectable({
    providedIn: 'root',
})
export class EventsFacade {

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
    industryLossList$: Observable<RemoteData<any, HttpErrorResponse>> = this.store.pipe(
        select(EventsSelectors.selectIndustryLossList)
    );
    hiscoxImpactList$: Observable<RemoteData<any, HttpErrorResponse>> = this.store.pipe(
        select(EventsSelectors.selectHiscoxImpactList)
    );

    constructor(private store: Store<EventsState>) { }

    loadEventTypeList(): void {
        this.store.dispatch(EventsActions.EventsSharedActions.getEventTypeList());
    }

    loadRegionPerilList(): void {
        this.store.dispatch(EventsActions.EventsSharedActions.getRegionPerilList());
    }

    loadEventsByEventType(payload: any): void {
        this.store.dispatch(EventsActions.EventsSharedActions.getEventsByEventType(payload));
    }

    loadIndustryLossList(): void {
        this.store.dispatch(EventsActions.EventsSharedActions.getIndustryLossList());
    }

    loadHiscoxImpactList(): void {
        this.store.dispatch(EventsActions.EventsSharedActions.getHiscoxImpactList());
    }

    addNewEvent(payload: any): void {
        this.store.dispatch(EventsActions.EventsSharedActions.addNewEvent({ payload }));
    }

    showLoadingSpinnerForApiResponses<T>(observables: Observable<RemoteData<T, HttpErrorResponse>>[], isComponentAlive: boolean): void {
        combineLatest(observables)
            .pipe(takeWhile(() => isComponentAlive))
            .subscribe(responses => {
                if (responses.some(response => isInProgress(response))) {
                    //   this.spinner.show();
                } else {
                    //   this.spinner.hide();
                }
            });
    }
}