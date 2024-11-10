import { createSelector, createFeatureSelector } from "@ngrx/store";
import { EventsState } from "./events.reducer";
import { RemoteData } from "ngx-remotedata";
import { HttpErrorResponse } from "@angular/common/http";
import { Event, EventType, RegionPeril } from '@shared/api-services/models';

export const selectEventsState = createFeatureSelector<EventsState>('events');

const selectEventTypeList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<EventType[], HttpErrorResponse> => state.eventsTypeList
);

const selectRegionPerilList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<RegionPeril[], HttpErrorResponse> => state.regionPerilList
);

const selectEventsByEventType = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<Event[], HttpErrorResponse> => state.eventsByEventType
);

const selectAddEvent = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<Event, HttpErrorResponse> => state.addEvent
);

const selectIndustryLossList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<number[], HttpErrorResponse> => state.industryLossList
);

const selectHiscoxImpactList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<string[], HttpErrorResponse> => state.hiscoxImpactList
);

export const EventsSelectors = {
  selectEventTypeList,
  selectRegionPerilList,
  selectIndustryLossList,
  selectHiscoxImpactList,
  selectEventsByEventType,
  selectAddEvent
};
