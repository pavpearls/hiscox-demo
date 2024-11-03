import { createAction, props } from '@ngrx/store';

//////////////////////////////////////////////////////
//                  Events Shared Actions           //
//////////////////////////////////////////////////////

const getEventTypeList = createAction('[Events Dashboard] Get Event Types');
const getEventTypeListSuccess = createAction('[Events Dashboard] Get Event Types Success', props<{ payload: any }>());
const getEventTypeListFailure = createAction('[Events Dashboard] Get Event Types Failure', props<{ error: any }>());

const getRegionPerilList = createAction('[Events Dashboard] Get Region Peril List');
const getRegionPerilListSuccess = createAction('[Events Dashboard] Get Region Peril List Success', props<{ payload: any }>());
const getRegionPerilListFailure = createAction('[Events Dashboard] GGet Region Peril List Failure', props<{ error: any }>());

const getEventsByEventType = createAction('[Events Dashboard] Get Events By Event Type', props<{ payload: any }>());
const getEventsByEventTypeSuccess = createAction('[Events Dashboard] Get Events By Event Type', props<{ payload: any }>());
const getEventsByEventTypeFailure = createAction('[Events Dashboard] Get Events By Event Type', props<{ error: any }>());

const addNewEvent = createAction('[Events Dashboard] Add New Event', props<{ payload: any }>());
const addNewEventSuccess = createAction('[Events Dashboard] Add New Event Success', props<{ payload: any }>());
const addNewEventFailure = createAction('[Events Dashboard] Add New Event Failure', props<{ error: any }>());

const EventsSharedActions = {
    getEventTypeList,
    getEventTypeListSuccess,
    getEventTypeListFailure,
    getRegionPerilList,
    getRegionPerilListSuccess,
    getRegionPerilListFailure,
    getEventsByEventType,
    getEventsByEventTypeSuccess,
    getEventsByEventTypeFailure,
    addNewEvent,
    addNewEventSuccess,
    addNewEventFailure
};

//////////////////////////////////////////////////////
//               RDS Event Page Actions             //
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
//               Post Event Page Actions            //
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
//               Event Response Actions             //
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
//               Exporting All Actions              //
//////////////////////////////////////////////////////

export const EventsActions = {
    EventsSharedActions,
};