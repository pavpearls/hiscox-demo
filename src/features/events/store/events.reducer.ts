import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import { notAsked, RemoteData, success, failure, inProgress } from "ngx-remotedata";
import { EventsActions } from "./events.actions";
import { EventType } from "@angular/router";
import { RegionPeril } from "../../../shared/api-services/nds-api/generated";

export interface EventsState {
    eventsTypeList: RemoteData<Array<EventType>[], HttpErrorResponse>;
    regionPerilList: RemoteData<Array<RegionPeril>[], HttpErrorResponse>;
    eventsByEventType: RemoteData<Array<Event>[], HttpErrorResponse>;
    hiscoxImpactList: RemoteData<Array<string>[], HttpErrorResponse>;
    industryLossList: RemoteData<Array<number>[], HttpErrorResponse>;
    addEvent: RemoteData<Event, HttpErrorResponse>;
}

const initialState: EventsState = {
    eventsTypeList: notAsked(),
    regionPerilList: notAsked(),
    hiscoxImpactList: notAsked(),
    industryLossList: notAsked(),
    eventsByEventType: notAsked(),
    addEvent: notAsked(),
};

export const eventsReducer = createReducer(
    initialState,
  
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
    })),

    on(EventsActions.EventsSharedActions.getIndustryLossList, (state) => ({
        ...state,
        industryLossList: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.getIndustryLossListSuccess, (state, { payload }) => ({
        ...state,
        industryLossList: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.getIndustryLossListFailure, (state, { error }) => ({
        ...state,
        industryLossList: failure(error) as any,
    })),

    on(EventsActions.EventsSharedActions.getHiscoxImpactList, (state) => ({
        ...state,
        hiscoxImpactList: inProgress() as any,
    })),
    on(EventsActions.EventsSharedActions.getHiscoxImpactListSuccess, (state, { payload }) => ({
        ...state,
        hiscoxImpactList: success(payload) as any,
    })),
    on(EventsActions.EventsSharedActions.getHiscoxImpactListFailure, (state, { error }) => ({
        ...state,
        hiscoxImpactList: failure(error) as any,
    }))
);