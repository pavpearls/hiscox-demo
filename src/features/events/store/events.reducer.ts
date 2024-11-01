import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import { notAsked, RemoteData, success, failure, inProgress } from "ngx-remotedata";
import { EventsActions } from "./events.actions";

export interface EventsState {
    eventsTypeList: RemoteData<any[], HttpErrorResponse>;
    regionPerilList: RemoteData<any[], HttpErrorResponse>;
    eventsByEventType: RemoteData<any[], HttpErrorResponse>;
    addEvent: RemoteData<any, HttpErrorResponse>;
}

const initialState: EventsState = {
    eventsTypeList: notAsked(),
    regionPerilList: notAsked(),
    eventsByEventType: notAsked(),
    addEvent: notAsked(),
};

export const eventsReducer = createReducer(
    initialState,
  
    // Get Event Type List
    on(EventsActions.EventsSharedActions.getEventTypeList, (state) => ({
        ...state,
        eventsTypeList: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.getEventTypeListSuccess, (state, { payload }) => ({
        ...state,
        eventsTypeList: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.getEventTypeListFailure, (state, { error }) => ({
        ...state,
        eventsTypeList: failure(error) as any,
    })),

    // Get Region Peril List
    on(EventsActions.EventsSharedActions.getRegionPerilList, (state) => ({
        ...state,
        regionPerilList: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.getRegionPerilListSuccess, (state, { payload }) => ({
        ...state,
        regionPerilList: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.getRegionPerilListFailure, (state, { error }) => ({
        ...state,
        regionPerilList: failure(error) as any,
    })),

    // Get Events By Event Type
    on(EventsActions.EventsSharedActions.getEventsByEventType, (state) => ({
        ...state,
        eventsByEventType: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.getEventsByEventTypeSuccess, (state, { payload }) => ({
        ...state,
        eventsByEventType: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.getEventsByEventTypeFailure, (state, { error }) => ({
        ...state,
        eventsByEventType: failure(error) as any,
    })),

    // Add New Event
    on(EventsActions.EventsSharedActions.addNewEvent, (state) => ({
        ...state,
        addEvent: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.addNewEventSuccess, (state, { payload }) => ({
        ...state,
        addEvent: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.addNewEventFailure, (state, { error }) => ({
        ...state,
        addEvent: failure(error) as any,
    }))
);
