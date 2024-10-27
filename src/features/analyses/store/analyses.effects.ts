import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';
import { loadAnalyses, loadAnalysesSuccess, loadAnalysesFailure } from './analyses.actions';
import { faker } from '@faker-js/faker';

@Injectable()
export class AnalysesEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  loadAnalyses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAnalyses),
      switchMap(() =>
        // Return random data instead of making an API call
        of(this.generateRandomAnalyses()).pipe(
          map(data => loadAnalysesSuccess({ data })),
          catchError(error => of(loadAnalysesFailure({ error: error.message })))
        )
      )
    )
  );

  generateRandomAnalyses() {
    const states = ["(O)Created", "(Run)", "(Published)"];
    const types = ["Event Response", "Post Event", "Scenario", "RDS", "Specific"];
    const owners = ["Rob Baxter", "Tom Clements", "Robbie S", "Steve Patfield", "Etso B"];

    const data = [];
    for (let i = 1; i <= 200; i++) {
      const analysis = {
        id: i,
        state: faker.helpers.arrayElement(states),  // Use arrayElement to randomize
        name: `(A-${i}) ${this.capitalize(faker.word.adjective())} Event`,
        type: faker.helpers.arrayElement(types),  // Use arrayElement to randomize
        eventSetId: `(ES-${faker.number.int({ min: 1, max: 50 })}) ${this.capitalize(faker.word.noun())} Event`,
        lossSetId: `(LS-${faker.number.int({ min: 1, max: 50 })}) ${this.capitalize(faker.word.noun())} Claims`,
        riSetId: `(RS-${faker.number.int({ min: 1, max: 50 })}) Inforce @ ${faker.date.between({ from: new Date('2023-01-01'), to: new Date('2025-12-31') }).toISOString().split('T')[0]}`,
        owner: faker.helpers.arrayElement(owners),  // Use arrayElement to randomize
        asOfDate: faker.date.past().toISOString().split('T')[0],
        lastUpdate: faker.date.past().toISOString().split('T')[0],
        inUse: faker.helpers.arrayElement(["Active", "InActive"])  // Use arrayElement to randomize
      };
      data.push(analysis);
    }
    return data;
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}