import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'analyses' },
  { path: 'analyses', loadChildren: () => import('./../features/analyses/analyses.module').then(m => m.AnalysesModule) , canActivate:[MsalGuard]},
  { path: 'events', loadChildren: () => import('./../features/events/events.module').then(m => m.EventsModule) , canActivate:[MsalGuard]},
  { path: 'losses', loadChildren: () => import('./../features/losses/losses.module').then(m => m.LossesModule) , canActivate:[MsalGuard]},
  { path: 'reference', loadChildren: () => import('./../features/reference/reference.module').then(m => m.ReferenceModule) , canActivate:[MsalGuard]},
  { path: 'reinsurance', loadChildren: () => import('./../features/reinsurance/reinsurance.module').then(m => m.ReinsuranceModule) , canActivate:[MsalGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
