import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NdsApiServiceWrapper } from '../../../shared/api-services/nds-api/custom/nds-api-service-wrapper';
import { EventsActions } from './events.actions';

@Injectable()
export class EventsEffects {
  constructor(
    private actions$: Actions,
    private ndsApiServiceWrapper: NdsApiServiceWrapper
  ) {}

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
        this.ndsApiServiceWrapper.parameterService.getIndustryLossList().pipe(
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
      mergeMap((payload: any) =>
        this.ndsApiServiceWrapper.eventService
          .getEventByEventTypeId(payload.eventTypeId)
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
          )
      )
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
}
