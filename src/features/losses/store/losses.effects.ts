import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of } from "rxjs";
import { FileUploadService, GrossLossService, LossSetService } from "shared/api-services/nds-api/generated";
import { LossActions } from "./losses.actions";

@Injectable()
export class LossEffects {
  constructor(
    private actions$: Actions,
    private fileUploadService: FileUploadService,
    private grossLossService: GrossLossService,
    private lossSetService: LossSetService
  ) {}

  uploadFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.uploadFile),
      mergeMap(({ file }) =>
        this.fileUploadService.apiFileUploadUploadFilePost(file).pipe(
          map(response => LossActions.uploadFileSuccess({ response })),
          catchError(error => of(LossActions.uploadFileFailure({ error })))
        )
      )
    )
  );

  validateFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.validateFile),
      mergeMap(({ file }) =>
        this.fileUploadService.apiFileUploadValidatePost(file).pipe(
          map(response => LossActions.validateFileSuccess({ response })),
          catchError(error => of(LossActions.validateFileFailure({ error })))
        )
      )
    )
  );

  createGrossLoss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.createGrossLoss),
      mergeMap(({ request }) =>
        this.grossLossService.createGrossLoss(request).pipe(
          map(response => LossActions.createGrossLossSuccess({ response })),
          catchError(error => of(LossActions.createGrossLossFailure({ error })))
        )
      )
    )
  );

  deleteGrossLoss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.deleteGrossLoss),
      mergeMap(({ id }) =>
        this.grossLossService.deleteGrossLoss(id).pipe(
          map(() => LossActions.deleteGrossLossSuccess({ id })),
          catchError(error => of(LossActions.deleteGrossLossFailure({ error })))
        )
      )
    )
  );

  getGrossLossById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getGrossLossById),
      mergeMap(({ id }) =>
        this.grossLossService.getGrossLossById(id).pipe(
          map(grossLoss => LossActions.getGrossLossByIdSuccess({ grossLoss })),
          catchError(error => of(LossActions.getGrossLossByIdFailure({ error })))
        )
      )
    )
  );

  getGrossLossByLossLoadId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getGrossLossByLossLoadId),
      mergeMap(({ lossLoadId }) =>
        this.grossLossService.getGrossLossByLossLoadId(lossLoadId).pipe(
          map(lossLoads => LossActions.getGrossLossByLossLoadIdSuccess({ lossLoads })),
          catchError(error => of(LossActions.getGrossLossByLossLoadIdFailure({ error })))
        )
      )
    )
  );

  getGrossLossList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getGrossLossList),
      mergeMap(() =>
        this.grossLossService.getGrossLossList().pipe(
          map(eventSets => LossActions.getGrossLossListSuccess({ eventSets })),
          catchError(error => of(LossActions.getGrossLossListFailure({ error })))
        )
      )
    )
  );

  updateGrossLoss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.updateGrossLoss),
      mergeMap(({ request }) =>
        this.grossLossService.updateGrossLoss(request).pipe(
          map(response => LossActions.updateGrossLossSuccess({ response })),
          catchError(error => of(LossActions.updateGrossLossFailure({ error })))
        )
      )
    )
  );

  createLossSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.createLossSet),
      mergeMap(({ request }) =>
        this.lossSetService.createLossSet(request).pipe(
          map(response => LossActions.createLossSetSuccess({ response })),
          catchError(error => of(LossActions.createLossSetFailure({ error })))
        )
      )
    )
  );

  deleteLossSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.deleteLossSet),
      mergeMap(({ id }) =>
        this.lossSetService.deleteLossSet(id).pipe(
          map(() => LossActions.deleteLossSetSuccess({ id })),
          catchError(error => of(LossActions.deleteLossSetFailure({ error })))
        )
      )
    )
  );

  getLossSetByEventSetId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getLossSetByEventSetId),
      mergeMap(({ eventSetId }) =>
        this.lossSetService.getLossSetByEventSetId(eventSetId).pipe(
          map(eventSets => LossActions.getLossSetByEventSetIdSuccess({ eventSets })),
          catchError(error => of(LossActions.getLossSetByEventSetIdFailure({ error })))
        )
      )
    )
  );

  getLossSetByEventSetTypeId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getLossSetByEventSetTypeId),
      mergeMap(({ eventSetTypeId }) =>
        this.lossSetService.getLossSetByEventSetTypeId(eventSetTypeId).pipe(
          map(eventSets => LossActions.getLossSetByEventSetTypeIdSuccess({ eventSets })),
          catchError(error => of(LossActions.getLossSetByEventSetTypeIdFailure({ error })))
        )
      )
    )
  );

  getLossSetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getLossSetById),
      mergeMap(({ id }) =>
        this.lossSetService.getLossSetById(id).pipe(
          map(lossSet => LossActions.getLossSetByIdSuccess({ lossSet })),
          catchError(error => of(LossActions.getLossSetByIdFailure({ error })))
        )
      )
    )
  );

  getLossSetList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.getLossSetList),
      mergeMap(() =>
        this.lossSetService.getLossSetList().pipe(
          map(eventSets => LossActions.getLossSetListSuccess({ eventSets })),
          catchError(error => of(LossActions.getLossSetListFailure({ error })))
        )
      )
    )
  );

  updateLossSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LossActions.updateLossSet),
      mergeMap(({ request }) =>
        this.lossSetService.updateLossSet(request).pipe(
          map(response => LossActions.updateLossSetSuccess({ response })),
          catchError(error => of(LossActions.updateLossSetFailure({ error })))
        )
      )
    )
  );
}
