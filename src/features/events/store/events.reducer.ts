import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import { Event, EventSet, EventSetMember, EventType, RegionPeril } from '@shared/api-services/models';
import { failure, inProgress, notAsked, RemoteData, success } from "ngx-remotedata";
import { EventsActions } from "./events.actions";

export interface CombinedEventsState {
    eventsState: EventsState;
    eventSetState: EventSetState;
    eventSetMembershipState: EventSetMembershipState;
}

export interface EventSetMembershipState {
    createMembership: RemoteData<EventSetMember, HttpErrorResponse>;
    updateMembership: RemoteData<EventSetMember, HttpErrorResponse>;
    deleteMembership: RemoteData<number, HttpErrorResponse>; // ID of the deleted membership
    getMembershipById: RemoteData<EventSetMember, HttpErrorResponse>;
    getMembershipList: RemoteData<EventSetMember[], HttpErrorResponse>;
}

const initialEventSetMembershipState: EventSetMembershipState = {
    createMembership: notAsked(),
    updateMembership: notAsked(),
    deleteMembership: notAsked(),
    getMembershipById: notAsked(),
    getMembershipList: notAsked(),
};

const initialCombinedState: CombinedEventsState = {
    eventsState: {
        eventsTypeList: notAsked(),
        regionPerilList: notAsked(),
        hiscoxImpactList: notAsked(),
        industryLossList: notAsked(),
        eventsByEventType: notAsked(),
        addEvent: notAsked(),
        deleteEvent: notAsked(),
        updateEvent: notAsked(),
        setActiveTab: ''
    },
    eventSetState: {
        createEventSet: notAsked(),
        createEventSetAndEvents: notAsked(),
        deleteEventSet: notAsked(),
        getEventSetById: notAsked(),
        getEventSetList: notAsked(),
        updateEventSet: notAsked(),
    },
    eventSetMembershipState: {
        createMembership: notAsked(),
        updateMembership: notAsked(),
        deleteMembership: notAsked(),
        getMembershipById: notAsked(),
        getMembershipList: notAsked()
    }
};

export interface EventSetState {
    createEventSet: RemoteData<EventSet, HttpErrorResponse>;
    createEventSetAndEvents: RemoteData<EventSet, HttpErrorResponse>;
    deleteEventSet: RemoteData<number, HttpErrorResponse>;
    getEventSetById: RemoteData<EventSet, HttpErrorResponse>;
    getEventSetList: RemoteData<EventSet[], HttpErrorResponse>;
    updateEventSet: RemoteData<EventSet, HttpErrorResponse>;
}

const initialEventSetState: EventSetState = {
    createEventSet: notAsked(),
    createEventSetAndEvents: notAsked(),
    deleteEventSet: notAsked(),
    getEventSetById: notAsked(),
    getEventSetList: notAsked(),
    updateEventSet: notAsked(),
};

export interface EventsState {
    eventsTypeList: RemoteData<EventType[], HttpErrorResponse>;
    regionPerilList: RemoteData<RegionPeril[], HttpErrorResponse>;
    eventsByEventType: RemoteData<Event[], HttpErrorResponse>;
    hiscoxImpactList: RemoteData<string[], HttpErrorResponse>;
    industryLossList: RemoteData<number[], HttpErrorResponse>;
    addEvent: RemoteData<Event, HttpErrorResponse>;
    deleteEvent: RemoteData<number, HttpErrorResponse>;
    updateEvent: RemoteData<Event, HttpErrorResponse>;
    setActiveTab: string;
}

const initialEventsState: EventsState = {
    eventsTypeList: notAsked(),
    regionPerilList: notAsked(),
    hiscoxImpactList: notAsked(),
    industryLossList: notAsked(),
    eventsByEventType: notAsked(),
    addEvent: notAsked(),
    deleteEvent: notAsked(),
    updateEvent: notAsked(),
    setActiveTab: ''
};

export const eventsReducer = createReducer(
    initialCombinedState,

    on(EventsActions.EventsCatalogDashboardActions.setActiveTab, (state, {activeTab}) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            setActiveTab: activeTab
        },
    })),

    on(EventsActions.EventsSharedActions.getEventTypeList, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsTypeList: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getEventTypeListSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsTypeList: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getEventTypeListFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsTypeList: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.getRegionPerilList, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            regionPerilList: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getRegionPerilListSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            regionPerilList: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getRegionPerilListFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            regionPerilList: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.getEventsByEventType, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsByEventType: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getEventsByEventTypeSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsByEventType: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getEventsByEventTypeFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            eventsByEventType: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.addNewEvent, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            addEvent: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.addNewEventSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            addEvent: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.addNewEventFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            addEvent: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.getIndustryLossList, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            industryLossList: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getIndustryLossListSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            industryLossList: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getIndustryLossListFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            industryLossList: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.getHiscoxImpactList, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            hiscoxImpactList: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getHiscoxImpactListSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            hiscoxImpactList: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.getHiscoxImpactListFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            hiscoxImpactList: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.deleteEvent, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            deleteEvent: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.deleteEventSuccess, (state, { id }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            deleteEvent: success(id) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.deleteEventFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            deleteEvent: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSharedActions.updateEvent, (state) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            updateEvent: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSharedActions.updateEventSuccess, (state, { payload }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            updateEvent: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSharedActions.updateEventFailure, (state, { error }) => ({
        ...state,
        eventsState: {
            ...state.eventsState,
            updateEvent: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.createEventSet, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSet: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.createEventSetSuccess, (state, { payload }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSet: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSetActions.createEventSetFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSet: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.createEventSetAndEvents, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSetAndEvents: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.createEventSetAndEventsSuccess, (state, { payload }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSetAndEvents: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSetActions.createEventSetAndEventsFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            createEventSetAndEvents: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.deleteEventSet, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            deleteEventSet: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.deleteEventSetSuccess, (state, { id }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            deleteEventSet: success(id) as any,
        },
    })),
    on(EventsActions.EventsSetActions.deleteEventSetFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            deleteEventSet: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.getEventSetById, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetById: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.getEventSetByIdSuccess, (state, { payload }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetById: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSetActions.getEventSetByIdFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetById: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.getEventSetList, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetList: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.getEventSetListSuccess, (state, { payload }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetList: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSetActions.getEventSetListFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            getEventSetList: failure(error) as any,
        },
    })),

    on(EventsActions.EventsSetActions.updateEventSet, (state) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            updateEventSet: inProgress() as any,
        },
    })),
    on(EventsActions.EventsSetActions.updateEventSetSuccess, (state, { payload }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            updateEventSet: success(payload) as any,
        },
    })),
    on(EventsActions.EventsSetActions.updateEventSetFailure, (state, { error }) => ({
        ...state,
        eventSetState: {
            ...state.eventSetState,
            updateEventSet: failure(error) as any,
        },
    })),

    on(EventsActions.EventSetMembershipActions.createMembership, (state) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            createMembership: inProgress() as any,
        },
    })),
    on(EventsActions.EventSetMembershipActions.createMembershipSuccess, (state, { membership }) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            createMembership: success(membership) as any,
        },
    })),
    on(EventsActions.EventSetMembershipActions.createMembershipFailure, (state, { error }) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            createMembership: failure(error) as any,
        },
    })),

    on(EventsActions.EventSetMembershipActions.getMembershipList, (state) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            getMembershipList: inProgress() as any,
        },
    })),
    on(EventsActions.EventSetMembershipActions.getMembershipListSuccess, (state, { memberships }) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            getMembershipList: success(memberships) as any,
        },
    })),
    on(EventsActions.EventSetMembershipActions.getMembershipListFailure, (state, { error }) => ({
        ...state,
        eventSetMembershipState: {
            ...state.eventSetMembershipState,
            getMembershipList: failure(error) as any,
        },
    })),
);
