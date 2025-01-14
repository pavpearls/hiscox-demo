import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filterSuccess } from 'ngx-remotedata';
import { catchError, EMPTY, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { NdsApiServiceWrapper } from '../../../shared/api-services/nds-api/custom/nds-api-service-wrapper';
import { EventSetService } from '../pages/events-set-dashboard/services/event-set.service';
import { EventsActions } from './events.actions';
import { EventsFacade } from './events.facade';

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

  getDataProducerList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.getDataProducerList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.parameterService.getDataProducerList().pipe(
          map((payload) =>
            EventsActions.EventsSharedActions.getDataProducerListSuccess({
              payload,
            })
          ),
          catchError((error) =>
            of(
              EventsActions.EventsSharedActions.getDataProducerListFailure({
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

  deleteEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSharedActions.deleteEvent),
        mergeMap(({ id }) =>
          this.ndsApiServiceWrapper.eventService.deleteEvent(id).pipe(
            map(() =>
              EventsActions.EventsSharedActions.deleteEventSuccess({ id })
            ),
            catchError((error: any) => {
              if (error?.status === 400) {
                this.notification.error(
                  'Delete Event Failed',
                  error?.detail ??
                  `Cannot delete this Event as gross losses for this Event exist. Either archive this Event or delete the Gross Losses.`
                );
              } else {
                this.notification.error(
                  'Delete Event Failed',
                  `An error occurred while deleting the event.`
                );
              }

              return of(EventsActions.EventsSharedActions.deleteEventFailure({ error }));

            })
          )
        )
      ),
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSharedActions.updateEvent),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventService.updateEvent(payload).pipe(
          map((response) =>
            EventsActions.EventsSharedActions.updateEventSuccess({
              payload: response,
            })
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
        const eventType = eventTypeList?.value.find(
          (type) =>
            type.eventTypeName?.toLowerCase() === activeTab.toLowerCase()
        );
        if (eventType) {
          return [
            EventsActions.EventsSharedActions.getEventsByEventType({
              payload: {
                eventTypeId: eventType.eventTypeID?.toString() as string,
              },
            }),
          ];
        } else {
          console.error(`No event type found for activeTab: ${activeTab}`);
          return [];
        }
      })
    )
  );

  deleteEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSharedActions.deleteEventSuccess),
        withLatestFrom(
          this.eventFacade.state.events.activeTab$,
          this.eventFacade.state.events.eventsTypeList$.pipe(filterSuccess())
        ),
        tap(([_, activeTab, eventTypeList]) => {
          const eventType = eventTypeList?.value.find(
            (type) =>
              type.eventTypeName?.toLowerCase() === activeTab.toLowerCase()
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

  updateEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSharedActions.updateEventSuccess),
        withLatestFrom(
          this.eventFacade.state.events.activeTab$,
          this.eventFacade.state.events.eventsTypeList$.pipe(filterSuccess())
        ),
        tap(([_, activeTab, eventTypeList]) => {
          const eventType = eventTypeList?.value.find(
            (type) =>
              type.eventTypeName?.toLowerCase() === activeTab.toLowerCase()
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
            EventsActions.EventsSetActions.createEventSetSuccess({
              payload: response,
            })
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
        this.ndsApiServiceWrapper.eventSetService
          .createEventSetAndEvents(payload)
          .pipe(
            map((response) =>
              EventsActions.EventsSetActions.createEventSetAndEventsSuccess({
                payload: response,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventsSetActions.createEventSetAndEventsFailure({
                  error,
                })
              )
            )
          )
      )
    )
  );

  createEventSetAndEventsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSetActions.createEventSetAndEventsSuccess),
        tap(() => {
          this.eventFacade.actions.eventSets.getEventSetList();
        })
      ),
    { dispatch: false }
  );

  deleteEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.deleteEventSet),
      mergeMap(({ id }) =>
        this.ndsApiServiceWrapper.eventSetService.deleteEventSet(id).pipe(
          map(() =>
            EventsActions.EventsSetActions.deleteEventSetSuccess({ id })
          ),
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
            EventsActions.EventsSetActions.getEventSetByIdSuccess({
              payload: response,
            })
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
            EventsActions.EventsSetActions.getEventSetListSuccess({
              payload: response,
            })
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
            EventsActions.EventsSetActions.getEventSetFlatListSuccess({
              payload: response,
            })
          ),
          catchError((error) =>
            of(
              EventsActions.EventsSetActions.getEventSetFlatListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  updateEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventsSetActions.updateEventSet),
      mergeMap(({ payload }) =>
        this.ndsApiServiceWrapper.eventSetService.updateEventSet(payload.eventSet).pipe(
          switchMap((response) => [
            EventsActions.EventsSetActions.updateEventSetSuccess({
              payload: response,
            }),
               EventsActions.EventSetMembershipActions.addEventsToEventSet({eventSetMemberList: payload.addedEventSetMemberItems, eventSetId: payload.eventSet.eventSetID,  deleteEventIdList: payload.deletedEventIds})
            ]),
          catchError((error) =>
            of(EventsActions.EventsSetActions.updateEventSetFailure({ error }))
          )
        )
      )
    )
  );

  updateEventSetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSetActions.updateEventSetSuccess),
        tap(() =>
          this.notification.success(
            'Update Event Set Successful',
            `Event Set has been updated successfully.`
          )
        )
      ),
    { dispatch: false }
  );

  updateEventSetFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSetActions.updateEventSetFailure),
        tap(() =>
          this.notification.success(
            'Update Event Set Failure',
            `Failed to update the Event Set`
          )
        )
      ),
    { dispatch: false }
  );

  deleteEventSetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSetActions.deleteEventSetSuccess),
        tap(() =>
          this.notification.success(
            'Delete Event Set Successful',
            `Event Set has been deleted successfully.`
          )
        )
      ),
    { dispatch: false }
  );

  deleteEventSetFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventsSetActions.deleteEventSetFailure),
        tap(() =>
          this.notification.error(
            'Delete Event Set Failure',
            `Failed to delete the Event Set.`
          )
        )
      ),
    { dispatch: false }
  );

  updateMembershipSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventSetMembershipActions.updateMembershipSuccess),
        tap(() =>
          this.notification.success(
            'Update Event Set Membership Successful',
            `Event Set membership has been updated successfully.`
          )
        )
      ),
    { dispatch: false }
  );

  updateMembershipFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.EventSetMembershipActions.updateMembershipFailure),
        tap(() =>
          this.notification.error(
            'Update Event Set Membership Failure',
            `Failed to update the Event Set membership.`
          )
        )
      ),
    { dispatch: false }
  );

  //////////////////////////////////////////////////////
  //               Event Sets Membership Effects      //
  //////////////////////////////////////////////////////

  createMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.createMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .createEventSetMember(action.membership)
          .pipe(
            map((membership) =>
              EventsActions.EventSetMembershipActions.createMembershipSuccess({
                membership,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.createMembershipFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );

  addEventsToEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.addEventsToEventSet),
      mergeMap((payload) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .addEventsToEventSet(payload.eventSetMemberList)
          .pipe(
            switchMap((eventSet) => [
              EventsActions.EventSetMembershipActions.addEventsToEventSetSuccess({
                eventSet,
              }),
              EventsActions.EventSetMembershipActions.deleteEventsFromEventSet({eventSetId: payload.eventSetId,  deleteEventIdList: payload.deleteEventIdList})
            ]
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.addEventsToEventSetFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );


  /*
(
          switchMap((response) => [
            EventsActions.EventsSetActions.updateEventSetSuccess({
              payload: response,
            }),
            EventsActions.EventSetMembershipActions.addEventsToEventSet({eventSetMemberList: payload.addedEventSetMemberItems}),
            EventsActions.EventSetMembershipActions.deleteEventsFromEventSet({eventSetId: payload.eventSet.eventSetID,  deleteEventIdList: payload.deletedEventIds})
            ]),
          catchError((error) =>
            of(EventsActions.EventsSetActions.updateEventSetFailure({ error }))
          )
        )
  */
  deleteEventsFromEventSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.deleteEventsFromEventSet),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .deleteEventsFromEventSet(action.eventSetId, action.deleteEventIdList)
          .pipe(
            map((eventSet) =>
              EventsActions.EventSetMembershipActions.deleteEventsFromEventSetSuccess({
                eventSet,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.deleteEventsFromEventSetFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );

  updateMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.updateMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .updateEventSetMember(action.membership)
          .pipe(
            map((membership) =>
              EventsActions.EventSetMembershipActions.updateMembershipSuccess({
                membership,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.updateMembershipFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );

  deleteMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.deleteMembership),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .deleteEventSetMember(action.id)
          .pipe(
            map((id) =>
              EventsActions.EventSetMembershipActions.deleteMembershipSuccess({
                id,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.deleteMembershipFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );

  getMembershipById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.getMembershipById),
      mergeMap((action) =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .getEventSetMemberById(action.id)
          .pipe(
            map((membership) =>
              EventsActions.EventSetMembershipActions.getMembershipByIdSuccess({
                membership,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.getMembershipByIdFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );

  getMembershipList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.EventSetMembershipActions.getMembershipList),
      mergeMap(() =>
        this.ndsApiServiceWrapper.eventSetMemberService
          .getEventSetMemberList()
          .pipe(
            map((memberships) =>
              EventsActions.EventSetMembershipActions.getMembershipListSuccess({
                memberships,
              })
            ),
            catchError((error) =>
              of(
                EventsActions.EventSetMembershipActions.getMembershipListFailure(
                  { error }
                )
              )
            )
          )
      )
    )
  );
}
