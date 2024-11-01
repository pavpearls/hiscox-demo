import { createSelector, createFeatureSelector } from "@ngrx/store";
import { EventsState } from "./events.reducer";
import { RemoteData } from "ngx-remotedata";
import { HttpErrorResponse } from "@angular/common/http";

// Feature Selector
export const selectEventsState = createFeatureSelector<EventsState>('events');

// Selectors for each API call
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

export const EventsSelectors = {
    selectEventTypeList,
    selectRegionPerilList,
    selectEventsByEventType,
    selectAddEvent
}