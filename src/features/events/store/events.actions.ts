import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Event, EventType, RegionPeril } from '@shared/api-services/models';

//////////////////////////////////////////////////////
//                  Events Shared Actions           //
//////////////////////////////////////////////////////

// Get Event Types
const getEventTypeList = createAction('[Events Dashboard] Get Event Types');
const getEventTypeListSuccess = createAction(
  '[Events Dashboard] Get Event Types Success',
  props<{ payload: EventType[] }>()
);
const getEventTypeListFailure = createAction(
  '[Events Dashboard] Get Event Types Failure',
  props<{ error: HttpErrorResponse }>()
);

// Get Region Peril List
const getRegionPerilList = createAction('[Events Dashboard] Get Region Peril List');
const getRegionPerilListSuccess = createAction(
  '[Events Dashboard] Get Region Peril List Success',
  props<{ payload: RegionPeril[] }>()
);
const getRegionPerilListFailure = createAction(
  '[Events Dashboard] Get Region Peril List Failure',
  props<{ error: HttpErrorResponse }>()
);

// Get Hiscox Impact List
const getHiscoxImpactList = createAction('[Events Dashboard] Get Hiscox Impact List');
const getHiscoxImpactListSuccess = createAction(
  '[Events Dashboard] Get Hiscox Impact List Success',
  props<{ payload: string[] }>()
);
const getHiscoxImpactListFailure = createAction(
  '[Events Dashboard] Get Hiscox Impact List Failure',
  props<{ error: HttpErrorResponse }>()
);

// Get Industry Loss List
const getIndustryLossList = createAction('[Events Dashboard] Get Industry Loss List');
const getIndustryLossListSuccess = createAction(
  '[Events Dashboard] Get Industry Loss List Success',
  props<{ payload: number[] }>()
);
const getIndustryLossListFailure = createAction(
  '[Events Dashboard] Get Industry Loss List Failure',
  props<{ error: HttpErrorResponse }>()
);

// Get Events By Event Type
const getEventsByEventType = createAction(
  '[Events Dashboard] Get Events By Event Type',
  props<{ payload: { eventTypeId: string } }>()
);
const getEventsByEventTypeSuccess = createAction(
  '[Events Dashboard] Get Events By Event Type Success',
  props<{ payload: Event[] }>()
);
const getEventsByEventTypeFailure = createAction(
  '[Events Dashboard] Get Events By Event Type Failure',
  props<{ error: HttpErrorResponse }>()
);

// Add New Event
const addNewEvent = createAction(
  '[Events Dashboard] Add New Event',
  props<{ payload: Event }>()
);
const addNewEventSuccess = createAction(
  '[Events Dashboard] Add New Event Success',
  props<{ payload: Event }>()
);
const addNewEventFailure = createAction(
  '[Events Dashboard] Add New Event Failure',
  props<{ error: HttpErrorResponse }>()
);

const EventsSharedActions = {
  getEventTypeList,
  getEventTypeListSuccess,
  getEventTypeListFailure,

  getRegionPerilList,
  getRegionPerilListSuccess,
  getRegionPerilListFailure,

  getHiscoxImpactList,
  getHiscoxImpactListSuccess,
  getHiscoxImpactListFailure,

  getIndustryLossList,
  getIndustryLossListSuccess,
  getIndustryLossListFailure,

  getEventsByEventType,
  getEventsByEventTypeSuccess,
  getEventsByEventTypeFailure,

  addNewEvent,
  addNewEventSuccess,
  addNewEventFailure,
};

//////////////////////////////////////////////////////
//               Exporting All Actions              //
//////////////////////////////////////////////////////

export const EventsActions = {
  EventsSharedActions,
};
