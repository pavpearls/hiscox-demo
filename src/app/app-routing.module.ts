import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'analyses' },
  { path: 'analyses', loadChildren: () => import('./../features/analyses/analyses.module').then(m => m.AnalysesModule) },
  { path: 'events', loadChildren: () => import('./../features/events/events.module').then(m => m.EventsModule) },
  { path: 'losses', loadChildren: () => import('./../features/losses/losses.module').then(m => m.LossesModule) },
  { path: 'reference', loadChildren: () => import('./../features/reference/reference.module').then(m => m.ReferenceModule) },
  { path: 'reinsurance', loadChildren: () => import('./../features/reinsurance/reinsurance.module').then(m => m.ReinsuranceModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
