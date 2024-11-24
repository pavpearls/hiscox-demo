import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { NdsApiServiceWrapper } from '../../../shared/api-services/nds-api/custom/nds-api-service-wrapper';
import { EventsActions } from './events.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventsFacade } from './events.facade';
import { filterSuccess } from 'ngx-remotedata';
import { EventSetService } from '../pages/events-set-dashboard/services/event-set.service';

@Injectable()
export class EventsEffects {
  constructor(
    private actions$: Actions,
    private ndsApiServiceWrapper: NdsApiServiceWrapper,
    private notification: NzNotificationService,
    private eventFacade: EventsFacade,
    private eventSetService: EventSetService
  ) { }

  //////////////////////////////////////////////////////
  //                  Events Shared Effects           //
  //////////////////////////////////////////////////////

  getEventTypeList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getEventTypeList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.parameterService.getEventTypeList().pipe(
          map((payload) =>
            EventsActions.EventsSharedActions.getEventTypeListSuccess({
              payload,
            })
          ),
          catchError((error) =>
            of(
              EventsActions.EventsSharedActions.getEventTypeListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  getRegionPerilList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getRegionPerilList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.parameterService.getRegionPerilList().pipe(
          map((payload) =>
            EventsActions.EventsSharedActions.getRegionPerilListSuccess({
              payload,
            })
          ),
          catchError((error) =>
            of(
              EventsActions.EventsSharedActions.getRegionPerilListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  getHiscoxImpactList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getHiscoxImpactList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.parameterService.getHiscoxImpactAsync().pipe(
          map((payload) =>
            EventsActions.EventsSharedActions.getHiscoxImpactListSuccess({
              payload,
            })
          ),
          catchError((error) =>
            of(
              EventsActions.EventsSharedActions.getHiscoxImpactListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  getIndustryLossList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getIndustryLossList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.parameterService
          .getIndustryLossEstimateList()
          .pipe(
            map((payload) =>
              EventsActions.EventsSharedActions.getIndustryLossListSuccess({
                payload,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventsSharedActions.getIndustryLossListFailure({
                  error,
                })
              )
            )
          )
      )
    )
  );

  getEventsByEventType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getEventsByEventType),
      mergeMap((payload: any) => {
        return this.ndsApiServiceWrapper.eventService
          .getEventByEventTypeId(Number(payload?.payload?.eventTypeId))
          .pipe(
            map((response) =>
              EventsActions.EventsSharedActions.getEventsByEventTypeSuccess({
                payload: response,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventsSharedActions.getEventsByEventTypeFailure({
                  error,
                })
              )
            )
          );
      })
    )
  );

  addNewEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.addNewEvent),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventService.createEvent(payload).pipe(
          map((response) =>
            EventsActions.EventsSharedActions.addNewEventSuccess({
              payload: response,
            })
          ),
          catchError((error) =>
            of(EventsActions.EventsSharedActions.addNewEventFailure({ error }))
          )
        )
      )
    )
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.deleteEvent),
      mergeMap(({ id }) =>
        this.ndsApiServiceWrapper.eventService.deleteEvent(id).pipe(
          map(() => EventsActions.EventsSharedActions.deleteEventSuccess({ id })),
          catchError((error) =>
            of(EventsActions.EventsSharedActions.deleteEventFailure({ error }))
          )
        )
      )
    )
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.updateEvent),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventService.updateEvent(payload).pipe(
          map((response) =>
            EventsActions.EventsSharedActions.updateEventSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSharedActions.updateEventFailure({ error }))
          )
        )
      )
    )
  );

  setActiveTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsCatalogDashboardActions.setActiveTab),
      withLatestFrom(
        this.eventFacade.state.events.eventsTypeList$.pipe(filterSuccess())
      ),
      mergeMap(([{ activeTab }, eventTypeList]) => {
        const eventType = eventTypeList?.value.find((type) => type.eventTypeName?.toLowerCase() === activeTab.toLowerCase());
        if (eventType) {
          return [
            EventsActions.EventsSharedActions.getEventsByEventType({
              payload: { eventTypeId: eventType.eventTypeID?.toString() as string },
            }),
          ];
        } else {
          console.error(`No event type found for activeTab: ${activeTab}`);
          return [];
        }
      })
    )
  );

  deleteEventFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSharedActions.deleteEventFailure),
        tap(() =>
          this.notification.error(
            'Delete Event Failed',
            `An error occurred while deleting the event.`
          )
        )
      ),
    { dispatch: false }
  );

  deleteEventSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.deleteEventSuccess),
      withLatestFrom(
        this.eventFacade.state.events.activeTab$,
        this.eventFacade.state.events.eventsTypeList$.pipe(filterSuccess())
      ),
      tap(([_, activeTab, eventTypeList]) => {
        const eventType = eventTypeList?.value.find(
          (type) => type.eventTypeName?.toLowerCase() === activeTab.toLowerCase()
        );
  
        if (eventType) {
          this.eventFacade.actions.events.loadEventsByEventType({
            eventTypeId: eventType.eventTypeID?.toString() as string,
          });
        } else {
          console.error(`No event type found for activeTab: ${activeTab}`);
        }
  
        this.notification.success(
          'Delete Event Successful',
          `Event has been deleted successfully.`
        );
      })
    ),
    { dispatch: false }
  );

  updateEventSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.updateEventSuccess),
      withLatestFrom(
        this.eventFacade.state.events.activeTab$,
        this.eventFacade.state.events.eventsTypeList$.pipe(filterSuccess())
      ),
      tap(([_, activeTab, eventTypeList]) => {
        const eventType = eventTypeList?.value.find(
          (type) => type.eventTypeName?.toLowerCase() === activeTab.toLowerCase()
        );
  
        if (eventType) {
          this.eventFacade.actions.events.loadEventsByEventType({
            eventTypeId: eventType.eventTypeID?.toString() as string,
          });
        } else {
          console.error(`No event type found for activeTab: ${activeTab}`);
        }
  
        // Show a success notification
        this.notification.success(
          'Update Event Successful',
          `Event has been updated successfully.`
        );
      })
    ),
    { dispatch: false }
  );

  updateEventFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSharedActions.updateEventFailure),
        tap(() =>
          this.notification.error(
            'Updating Event Failed',
            'An error occurred while updating the event.'
          )
        )
      ),
    { dispatch: false }
  );

  //////////////////////////////////////////////////////
  //               Event Sets Effects                 //
  //////////////////////////////////////////////////////

  createEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.createEventSet),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventSetService.createEventSet(payload).pipe(
          map((response) =>
            EventsActions.EventsSetActions.createEventSetSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.createEventSetFailure({ error }))
          )
        )
      )
    )
  );

  createEventSetAndEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.createEventSetAndEvents),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventSetService.createEventSetAndEvents(payload).pipe(
          map((response) =>
            EventsActions.EventsSetActions.createEventSetAndEventsSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.createEventSetAndEventsFailure({ error }))
          )
        )
      )
    )
  );

  deleteEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.deleteEventSet),
      mergeMap(({ id }) =>
        this.ndsApiServiceWrapper.eventSetService.deleteEventSet(id).pipe(
          map(() => EventsActions.EventsSetActions.deleteEventSetSuccess({ id })),
          catchError((error) =>
            of(EventsActions.EventsSetActions.deleteEventSetFailure({ error }))
          )
        )
      )
    )
  );

  getEventSetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.getEventSetById),
      mergeMap(({ id }) =>
        this.ndsApiServiceWrapper.eventSetService.getEventSetById(id).pipe(
          map((response) =>
            EventsActions.EventsSetActions.getEventSetByIdSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.getEventSetByIdFailure({ error }))
          )
        )
      )
    )
  );

  getEventSetList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.getEventSetList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.eventSetService.getEventSetList().pipe(
          map((response) =>
            EventsActions.EventsSetActions.getEventSetListSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.getEventSetListFailure({ error }))
          )
        )
      )
    )
  );

  getEventSetFlatList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.getEventSetFlatList),
      mergeMap(() =>
        this.eventSetService.getEventSetFlatList().pipe(
          map((response) =>
            EventsActions.EventsSetActions.getEventSetFlatListSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.getEventSetFlatListFailure({ error }))
          )
        )
      )
    )
  );

  updateEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.updateEventSet),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventSetService.updateEventSet(payload).pipe(
          map((response) =>
            EventsActions.EventsSetActions.updateEventSetSuccess({ payload: response })
          ),
          catchError((error) =>
            of(EventsActions.EventsSetActions.updateEventSetFailure({ error }))
          )
        )
      )
    )
  );

  //////////////////////////////////////////////////////
  //               Event Sets Membership Effects      //
  //////////////////////////////////////////////////////

  createMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.createMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService.createEventSetMember(action.membership).pipe(
          map((membership) =>
            EventsActions.EventSetMembershipActions.createMembershipSuccess({ membership })
          ),
          catchError((error) =>
            of(EventsActions.EventSetMembershipActions.createMembershipFailure({ error }))
          )
        )
      )
    )
  );

  updateMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.updateMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService.updateEventSetMember(action.membership).pipe(
          map((membership) =>
            EventsActions.EventSetMembershipActions.updateMembershipSuccess({ membership })
          ),
          catchError((error) =>
            of(EventsActions.EventSetMembershipActions.updateMembershipFailure({ error }))
          )
        )
      )
    )
  );

  deleteMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.deleteMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService.deleteEventSetMember(action.id).pipe(
          map((id) =>
            EventsActions.EventSetMembershipActions.deleteMembershipSuccess({ id })
          ),
          catchError((error) =>
            of(EventsActions.EventSetMembershipActions.deleteMembershipFailure({ error }))
          )
        )
      )
    )
  );

  getMembershipById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.getMembershipById),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService.getEventSetMemberById(action.id).pipe(
          map((membership) =>
            EventsActions.EventSetMembershipActions.getMembershipByIdSuccess({ membership })
          ),
          catchError((error) =>
            of(EventsActions.EventSetMembershipActions.getMembershipByIdFailure({ error }))
          )
        )
      )
    )
  );

  getMembershipList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.getMembershipList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.eventSetMemberService.getEventSetMemberList().pipe(
          map((memberships) =>
            EventsActions.EventSetMembershipActions.getMembershipListSuccess({ memberships })
          ),
          catchError((error) =>
            of(EventsActions.EventSetMembershipActions.getMembershipListFailure({ error }))
          )
        )
      )
    )
  );
}
