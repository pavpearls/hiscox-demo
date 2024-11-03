import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { EventsActions } from './events.actions';
import { EventService } from '../../../shared/api-services/nds-api/generated';

@Injectable()
export class EventsEffects {
  constructor(private actions$: Actions, private eventService: EventService) {}

  // Effect for fetching event types
//   getEventTypeList$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(EventsActions.EventsSharedActions.getEventTypeList),
//       mergeMap(() =>
//         this.eventService.getEventTypeList().pipe(
//           map((payload) => EventsActions.EventsSharedActions.getEventTypeListSuccess({ payload })),
//           catchError((error) => of(EventsActions.EventsSharedActions.getEventTypeListFailure({ error })))
//         )
//       )
//     )
//   );

//   // Effect for fetching region peril list
//   getRegionPerilList$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(EventsActions.EventsSharedActions.getRegionPerilList),
//       mergeMap(() =>
//         this.eventService.getRegionPerilList().pipe(
//           map((payload) => EventsActions.EventsSharedActions.getRegionPerilListSuccess({ payload })),
//           catchError((error) => of(EventsActions.EventsSharedActions.getRegionPerilListFailure({ error })))
//         )
//       )
//     )
//   );

//   // Effect for fetching events by event type
//   getEventsByEventType$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(EventsActions.EventsSharedActions.getEventsByEventType),
//       mergeMap(({ payload }) =>
//         this.eventService.getEventsByEventType(payload).pipe(
//           map((response) => EventsActions.EventsSharedActions.getEventsByEventTypeSuccess({ payload: response })),
//           catchError((error) => of(EventsActions.EventsSharedActions.getEventsByEventTypeFailure({ error })))
//         )
//       )
//     )
//   );

//   // Effect for adding a new event
//   addNewEvent$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(EventsActions.EventsSharedActions.addNewEvent),
//       mergeMap(({ payload }) =>
//         this.eventService.addNewEvent(payload).pipe(
//           map((response) => EventsActions.EventsSharedActions.addNewEventSuccess({ payload: response })),
//           catchError((error) => of(EventsActions.EventsSharedActions.addNewEventFailure({ error })))
//         )
//       )
//     )
//   );
}
