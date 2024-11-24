import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CombinedEventsState, EventsState, EventSetState, EventSetMembershipState } from "./events.reducer";
import { RemoteData } from "ngx-remotedata";
import { HttpErrorResponse } from "@angular/common/http";
import { Event, EventSet, EventType, RegionPeril, EventSetMember } from '@shared/api-services/models';

export const selectCombinedState = createFeatureSelector<CombinedEventsState>('events');

export const selectEventsState = createSelector(
  selectCombinedState,
  (state: CombinedEventsState): EventsState => state.eventsState
);

export const selectEventSetState = createSelector(
  selectCombinedState,
  (state: CombinedEventsState): EventSetState => state.eventSetState
);

export const selectEventSetMembershipState = createSelector(
  selectCombinedState,
  (state: CombinedEventsState): EventSetMembershipState => state.eventSetMembershipState
);

export const selectActiveTab = createSelector(
  selectEventsState,
  (state: EventsState): string => state.setActiveTab
);

export const selectEventTypeList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<EventType[], HttpErrorResponse> => state.eventsTypeList
);

export const selectRegionPerilList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<RegionPeril[], HttpErrorResponse> => state.regionPerilList
);

export const selectEventsByEventType = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<Event[], HttpErrorResponse> => state.eventsByEventType
);

export const selectAddEvent = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<Event, HttpErrorResponse> => state.addEvent
);

export const selectIndustryLossList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<number[], HttpErrorResponse> => state.industryLossList
);

export const selectHiscoxImpactList = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<string[], HttpErrorResponse> => state.hiscoxImpactList
);

export const selectDeleteEvent = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<number, HttpErrorResponse> => state.deleteEvent
);

export const selectUpdateEvent = createSelector(
  selectEventsState,
  (state: EventsState): RemoteData<Event, HttpErrorResponse> => state.updateEvent
);

export const selectCreateEventSet = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<EventSet, HttpErrorResponse> => state.createEventSet
);

export const selectCreateEventSetAndEvents = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<EventSet, HttpErrorResponse> => state.createEventSetAndEvents
);

export const selectDeleteEventSet = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<number, HttpErrorResponse> => state.deleteEventSet
);

export const selectGetEventSetById = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<EventSet, HttpErrorResponse> => state.getEventSetById
);

export const selectGetEventSetList = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<EventSet[], HttpErrorResponse> => state.getEventSetList
);

export const selectGetEventSetFlatList = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<any[], HttpErrorResponse> => state.getEventSetFlatList
);

export const selectUpdateEventSet = createSelector(
  selectEventSetState,
  (state: EventSetState): RemoteData<EventSet, HttpErrorResponse> => state.updateEventSet
);

export const selectCreateMembership = createSelector(
  selectEventSetMembershipState,
  (state: EventSetMembershipState): RemoteData<EventSetMember, HttpErrorResponse> => state.createMembership
);

export const selectUpdateMembership = createSelector(
  selectEventSetMembershipState,
  (state: EventSetMembershipState): RemoteData<EventSetMember, HttpErrorResponse> => state.updateMembership
);

export const selectDeleteMembership = createSelector(
  selectEventSetMembershipState,
  (state: EventSetMembershipState): RemoteData<number, HttpErrorResponse> => state.deleteMembership
);

export const selectMembershipById = createSelector(
  selectEventSetMembershipState,
  (state: EventSetMembershipState): RemoteData<EventSetMember, HttpErrorResponse> => state.getMembershipById
);

export const selectMembershipList = createSelector(
  selectEventSetMembershipState,
  (state: EventSetMembershipState): RemoteData<EventSetMember[], HttpErrorResponse> => state.getMembershipList
);

export const EventsSelectors = {
  selectEventTypeList,
  selectRegionPerilList,
  selectIndustryLossList,
  selectHiscoxImpactList,
  selectEventsByEventType,
  selectAddEvent,
  selectDeleteEvent,
  selectUpdateEvent,
  selectActiveTab,

  selectCreateEventSet,
  selectCreateEventSetAndEvents,
  selectDeleteEventSet,
  selectGetEventSetById,
  selectGetEventSetList,
  selectGetEventSetFlatList,
  selectUpdateEventSet,

  selectCreateMembership,
  selectUpdateMembership,
  selectDeleteMembership,
  selectMembershipById,
  selectMembershipList,
};
