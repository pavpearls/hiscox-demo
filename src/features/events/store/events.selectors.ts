import { createSelector, createFeatureSelector } from "@ngrx/store";
import { EventsState } from "./events.reducer";
import { RemoteData } from "ngx-remotedata";
import { HttpErrorResponse } from "@angular/common/http";

export const selectEventsState = createFeatureSelector<EventsState>('events');

const selectEventTypeList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any[], HttpErrorResponse> => state.eventsTypeList
);

const selectRegionPerilList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any[], HttpErrorResponse> => state.regionPerilList
);

const selectEventsByEventType = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any[], HttpErrorResponse> => state.eventsByEventType
);

const selectAddEvent = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any, HttpErrorResponse> => state.addEvent
);

const selectIndustryLossList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any, HttpErrorResponse> => state.industryLossList
);

const selectHiscoxImpactList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<any, HttpErrorResponse> => state.hiscoxImpactList
);

export const EventsSelectors = {
    selectEventTypeList,
    selectRegionPerilList,
    selectIndustryLossList,
    selectHiscoxImpactList,
    selectEventsByEventType,
    selectAddEvent
}