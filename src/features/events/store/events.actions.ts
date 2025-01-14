import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { DataProducer, Event, EventSet, EventSetAndEventsRequest, EventSetMember, EventSetRequest, EventType, RegionPeril } from '@shared/api-services/models';

//////////////////////////////////////////////////////
//                  Events Actions                  //
//////////////////////////////////////////////////////

const setActiveTab = createAction('[Events Catalog Dashboard] Set Active Tab', props<{activeTab: string}>());

const EventsCatalogDashboardActions = {
  setActiveTab
}
//////////////////////////////////////////////////////
//                  Events Shared Actions           //
//////////////////////////////////////////////////////

const getEventTypeList = createAction('[Events Dashboard] Get Event Types');
const getEventTypeListSuccess = createAction(
  '[Events Dashboard] Get Event Types Success',
  props<{ payload: EventType[] }>()
);
const getEventTypeListFailure = createAction(
  '[Events Dashboard] Get Event Types Failure',
  props<{ error: HttpErrorResponse }>()
);

const getRegionPerilList = createAction('[Events Dashboard] Get Region Peril List');
const getRegionPerilListSuccess = createAction(
  '[Events Dashboard] Get Region Peril List Success',
  props<{ payload: RegionPeril[] }>()
);
const getRegionPerilListFailure = createAction(
  '[Events Dashboard] Get Region Peril List Failure',
  props<{ error: HttpErrorResponse }>()
);

const getHiscoxImpactList = createAction('[Events Dashboard] Get Hiscox Impact List');
const getHiscoxImpactListSuccess = createAction(
  '[Events Dashboard] Get Hiscox Impact List Success',
  props<{ payload: string[] }>()
);
const getHiscoxImpactListFailure = createAction(
  '[Events Dashboard] Get Hiscox Impact List Failure',
  props<{ error: HttpErrorResponse }>()
);

const getIndustryLossList = createAction('[Events Dashboard] Get Industry Loss List');
const getIndustryLossListSuccess = createAction(
  '[Events Dashboard] Get Industry Loss List Success',
  props<{ payload: number[] }>()
);
const getIndustryLossListFailure = createAction(
  '[Events Dashboard] Get Industry Loss List Failure',
  props<{ error: HttpErrorResponse }>()
);

const getDataProducerList = createAction('[Events Dashboard] Get DataProducer List');
const getDataProducerListSuccess = createAction(
  '[Events Dashboard] Get DataProducer List Success',
  props<{ payload: DataProducer[] }>()
);
const getDataProducerListFailure = createAction(
  '[Events Dashboard] Get DataProducer List Failure',
  props<{ error: HttpErrorResponse }>()
);

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

const deleteEvent = createAction(
  '[Events Dashboard] Delete Event',
  props<{ id: number }>()
);
const deleteEventSuccess = createAction(
  '[Events Dashboard] Delete Event Success',
  props<{ id: number }>()
);
const deleteEventFailure = createAction(
  '[Events Dashboard] Delete Event Failure',
  props<{ error: HttpErrorResponse }>()
);

const updateEvent = createAction(
  '[Events Dashboard] Update Event',
  props<{ payload: Event }>()
);
const updateEventSuccess = createAction(
  '[Events Dashboard] Update Event Success',
  props<{ payload: Event }>()
);
const updateEventFailure = createAction(
  '[Events Dashboard] Update Event Failure',
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

  getDataProducerList,
  getDataProducerListSuccess,
  getDataProducerListFailure,

  getEventsByEventType,
  getEventsByEventTypeSuccess,
  getEventsByEventTypeFailure,

  addNewEvent,
  addNewEventSuccess,
  addNewEventFailure,

  deleteEvent,
  deleteEventSuccess,
  deleteEventFailure,

  updateEvent,
  updateEventSuccess,
  updateEventFailure,
};

//////////////////////////////////////////////////////
//               Event Sets Actions                 //
//////////////////////////////////////////////////////

const createEventSet = createAction(
  '[Event Set] Create Event Set',
  props<{ payload: EventSetRequest }>()
);
const createEventSetSuccess = createAction(
  '[Event Set] Create Event Set Success',
  props<{ payload: EventSet }>()
);
const createEventSetFailure = createAction(
  '[Event Set] Create Event Set Failure',
  props<{ error: HttpErrorResponse }>()
);

const createEventSetAndEvents = createAction(
  '[Event Set] Create Event Set And Events',
  props<{ payload: EventSetAndEventsRequest }>()
);
const createEventSetAndEventsSuccess = createAction(
  '[Event Set] Create Event Set And Events Success',
  props<{ payload: EventSet }>()
);
const createEventSetAndEventsFailure = createAction(
  '[Event Set] Create Event Set And Events Failure',
  props<{ error: HttpErrorResponse }>()
);

const deleteEventSet = createAction(
  '[Event Set] Delete Event Set',
  props<{ id: number }>()
);
const deleteEventSetSuccess = createAction(
  '[Event Set] Delete Event Set Success',
  props<{ id: number }>()
);
const deleteEventSetFailure = createAction(
  '[Event Set] Delete Event Set Failure',
  props<{ error: HttpErrorResponse }>()
);

const getEventSetById = createAction(
  '[Event Set] Get Event Set By ID',
  props<{ id: number }>()
);
const getEventSetByIdSuccess = createAction(
  '[Event Set] Get Event Set By ID Success',
  props<{ payload: EventSet }>()
);
const getEventSetByIdFailure = createAction(
  '[Event Set] Get Event Set By ID Failure',
  props<{ error: HttpErrorResponse }>()
);

const getEventSetList = createAction('[Event Set] Get Event Set List');
const getEventSetListSuccess = createAction(
  '[Event Set] Get Event Set List Success',
  props<{ payload: EventSet[] }>()
);
const getEventSetListFailure = createAction(
  '[Event Set] Get Event Set List Failure',
  props<{ error: HttpErrorResponse }>()
);

const getEventSetFlatList = createAction('[Event Set] Get Event Set Flat List');
const getEventSetFlatListSuccess = createAction(
  '[Event Set] Get Event Set Flat List Success',
  props<{ payload: EventSet[] }>()
);
const getEventSetFlatListFailure = createAction(
  '[Event Set] Get Event Set Flat List Failure',
  props<{ error: HttpErrorResponse }>()
);


const updateEventSet = createAction(
  '[Event Set] Update Event Set',
  props<{ payload: any }>()
);
const updateEventSetSuccess = createAction(
  '[Event Set] Update Event Set Success',
  props<{ payload: EventSet }>()
);
const updateEventSetFailure = createAction(
  '[Event Set] Update Event Set Failure',
  props<{ error: HttpErrorResponse }>()
);

const EventsSetActions = {
  createEventSet,
  createEventSetSuccess,
  createEventSetFailure,

  createEventSetAndEvents,
  createEventSetAndEventsSuccess,
  createEventSetAndEventsFailure,

  deleteEventSet,
  deleteEventSetSuccess,
  deleteEventSetFailure,

  getEventSetById,
  getEventSetByIdSuccess,
  getEventSetByIdFailure,

  getEventSetList,
  getEventSetListSuccess,
  getEventSetListFailure,

  getEventSetFlatList,
  getEventSetFlatListSuccess,
  getEventSetFlatListFailure,

  updateEventSet,
  updateEventSetSuccess,
  updateEventSetFailure
};

//////////////////////////////////////////////////////
//               Event Sets Membership              //
//////////////////////////////////////////////////////

const createMembership = createAction(
  '[EventSetMembership] Create Membership',
  props<{ membership: EventSetMember }>()
);

const createMembershipSuccess = createAction(
  '[EventSetMembership] Create Membership Success',
  props<{ membership: EventSetMember }>()
);

const createMembershipFailure = createAction(
  '[EventSetMembership] Create Membership Failure',
  props<{ error: HttpErrorResponse }>()
);

const addEventsToEventSet = createAction(
  '[EventSetMembership] Add Events To EventSet',
  props<{ eventSetMemberList: EventSetMember[], eventSetId: number,  deleteEventIdList: number[]  }>()
);

const addEventsToEventSetSuccess = createAction(
  '[EventSetMembership] Add Events To EventSet Success',
  props<{ eventSet: EventSet }>()
);

const addEventsToEventSetFailure = createAction(
  '[EventSetMembership] Add Events To EventSet Failure',
  props<{ error: HttpErrorResponse }>()
);

const deleteEventsFromEventSet = createAction(
  '[EventSetMembership] Delete Events From EventSet',
  props<{ eventSetId:number, deleteEventIdList: number[] }>()
);

const deleteEventsFromEventSetSuccess = createAction(
  '[EventSetMembership] Delete Events From EventSet Success',
  props<{ eventSet: EventSet }>()
);

const deleteEventsFromEventSetFailure = createAction(
  '[EventSetMembership] Delete Events From EventSet Failure',
  props<{ error: HttpErrorResponse }>()
);

const updateMembership = createAction(
  '[EventSetMembership] Update Membership',
  props<{ membership: EventSetMember }>()
);

const updateMembershipSuccess = createAction(
  '[EventSetMembership] Update Membership Success',
  props<{ membership: EventSetMember }>()
);

const updateMembershipFailure = createAction(
  '[EventSetMembership] Update Membership Failure',
  props<{ error: HttpErrorResponse }>()
);

const deleteMembership = createAction(
  '[EventSetMembership] Delete Membership',
  props<{ id: number }>()
);

const deleteMembershipSuccess = createAction(
  '[EventSetMembership] Delete Membership Success',
  props<{ id: number }>()
);

const deleteMembershipFailure = createAction(
  '[EventSetMembership] Delete Membership Failure',
  props<{ error: HttpErrorResponse }>()
);

const getMembershipById = createAction(
  '[EventSetMembership] Get Membership By ID',
  props<{ id: number }>()
);

const getMembershipByIdSuccess = createAction(
  '[EventSetMembership] Get Membership By ID Success',
  props<{ membership: EventSetMember }>()
);

const getMembershipByIdFailure = createAction(
  '[EventSetMembership] Get Membership By ID Failure',
  props<{ error: HttpErrorResponse }>()
);

const getMembershipList = createAction('[EventSetMembership] Get Membership List');

const getMembershipListSuccess = createAction(
  '[EventSetMembership] Get Membership List Success',
  props<{ memberships: EventSetMember[] }>()
);

const getMembershipListFailure = createAction(
  '[EventSetMembership] Get Membership List Failure',
  props<{ error: HttpErrorResponse }>()
);

export const EventSetMembershipActions = {
  createMembership,
  createMembershipSuccess,
  createMembershipFailure,

  updateMembership,
  updateMembershipSuccess,
  updateMembershipFailure,

  deleteMembership,
  deleteMembershipSuccess,
  deleteMembershipFailure,

  getMembershipById,
  getMembershipByIdSuccess,
  getMembershipByIdFailure,

  getMembershipList,
  getMembershipListSuccess,
  getMembershipListFailure,

  addEventsToEventSet,
  addEventsToEventSetSuccess,
  addEventsToEventSetFailure,

  deleteEventsFromEventSet,
  deleteEventsFromEventSetSuccess,
  deleteEventsFromEventSetFailure,

};

//////////////////////////////////////////////////////
//               Exporting All Actions              //
//////////////////////////////////////////////////////

export const EventsActions = {
  EventsSharedActions,
  EventsSetActions,
  EventSetMembershipActions,
  EventsCatalogDashboardActions
};
