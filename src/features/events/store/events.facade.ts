import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Event, EventSet, EventSetMember } from '@shared/api-services/models';
import { isInProgress } from 'ngx-remotedata';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, map } from 'rxjs';
import { EventsActions } from './events.actions';
import { CombinedEventsState } from './events.reducer';
import { EventsSelectors } from './events.selectors';

@Injectable({
    providedIn: 'root',
})
export class EventsFacade {
    constructor(private store: Store<CombinedEventsState>, private spinner: NgxSpinnerService) { }

    state = {
        events: {
            eventsTypeList$: this.store.pipe(select(EventsSelectors.selectEventTypeList)),
            regionPerilList$: this.store.pipe(select(EventsSelectors.selectRegionPerilList)),
            eventsByEventType$: this.store.pipe(select(EventsSelectors.selectEventsByEventType)),
            addEvent$: this.store.pipe(select(EventsSelectors.selectAddEvent)),
            industryLossList$: this.store.pipe(select(EventsSelectors.selectIndustryLossList)),
            hiscoxImpactList$: this.store.pipe(select(EventsSelectors.selectHiscoxImpactList)),
            deleteEvent$: this.store.pipe(select(EventsSelectors.selectDeleteEvent)),
            updateEvent$: this.store.pipe(select(EventsSelectors.selectUpdateEvent)),
            activeTab$: this.store.pipe(select(EventsSelectors.selectActiveTab))
        },
        eventSets: {
            createEventSet$: this.store.pipe(select(EventsSelectors.selectCreateEventSet)),
            createEventSetAndEvents$: this.store.pipe(select(EventsSelectors.selectCreateEventSetAndEvents)),
            deleteEventSet$: this.store.pipe(select(EventsSelectors.selectDeleteEventSet)),
            getEventSetById$: this.store.pipe(select(EventsSelectors.selectGetEventSetById)),
            getEventSetList$: this.store.pipe(select(EventsSelectors.selectGetEventSetList)),
            getEventSetFlatList$: this.store.pipe(select(EventsSelectors.selectGetEventSetFlatList)),
            updateEventSet$: this.store.pipe(select(EventsSelectors.selectUpdateEventSet)),
        },
        eventSetMemberships: {
            createMembership$: this.store.pipe(select(EventsSelectors.selectCreateMembership)),
            updateMembership$: this.store.pipe(select(EventsSelectors.selectUpdateMembership)),
            deleteMembership$: this.store.pipe(select(EventsSelectors.selectDeleteMembership)),
            membershipById$: this.store.pipe(select(EventsSelectors.selectMembershipById)),
            membershipList$: this.store.pipe(select(EventsSelectors.selectMembershipList)),
        },
    };

    actions = {
        events: {
            setActiveTab: (activeTab: string): void => {
                this.store.dispatch(EventsActions.EventsCatalogDashboardActions.setActiveTab({activeTab}))
            },
            loadEventTypeList: (): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.getEventTypeList());
            },
            loadRegionPerilList: (): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.getRegionPerilList());
            },
            loadEventsByEventType: (payload: { eventTypeId: string }): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.getEventsByEventType({ payload }));
            },
            loadIndustryLossList: (): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.getIndustryLossList());
            },
            loadHiscoxImpactList: (): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.getHiscoxImpactList());
            },
            addNewEvent: (payload: Event): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.addNewEvent({ payload }));
            },
            deleteEvent: (id: number): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.deleteEvent({ id }));
            },
            updateEvent: (payload: Event): void => {
                this.store.dispatch(EventsActions.EventsSharedActions.updateEvent({ payload }));
            },
        },
        eventSets: {
            createEventSet: (payload: EventSet): void => {
                this.store.dispatch(EventsActions.EventsSetActions.createEventSet({ payload }));
            },
            createEventSetAndEvents: (payload: EventSet): void => {
                this.store.dispatch(EventsActions.EventsSetActions.createEventSetAndEvents({ payload }));
            },
            deleteEventSet: (id: number): void => {
                this.store.dispatch(EventsActions.EventsSetActions.deleteEventSet({ id }));
            },
            getEventSetById: (id: number): void => {
                this.store.dispatch(EventsActions.EventsSetActions.getEventSetById({ id }));
            },
            getEventSetList: (): void => {
                this.store.dispatch(EventsActions.EventsSetActions.getEventSetList());
            },
            getEventSetFlatList: (): void => {
                this.store.dispatch(EventsActions.EventsSetActions.getEventSetFlatList());
            },
            updateEventSet: (payload: EventSet): void => {
                this.store.dispatch(EventsActions.EventsSetActions.updateEventSet({ payload }));
            },
        },
        eventSetMemberships: {
            createMembership: (membership: EventSetMember): void => {
                this.store.dispatch(EventsActions.EventSetMembershipActions.createMembership({ membership }));
            },
            updateMembership: (membership: EventSetMember): void => {
                this.store.dispatch(EventsActions.EventSetMembershipActions.updateMembership({ membership }));
            },
            deleteMembership: (id: number): void => {
                this.store.dispatch(EventsActions.EventSetMembershipActions.deleteMembership({ id }));
            },
            getMembershipById: (id: number): void => {
                this.store.dispatch(EventsActions.EventSetMembershipActions.getMembershipById({ id }));
            },
            getMembershipList: (): void => {
                this.store.dispatch(EventsActions.EventSetMembershipActions.getMembershipList());
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
