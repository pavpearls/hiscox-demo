import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsCatalogDashboardComponent } from './pages/events-catalog-dashboard/events-catalog-dashboard.component';
import { EventsSetDashboardComponent } from './pages/events-set-dashboard/events-set-dashboard.component';

const routes: Routes = [
  { path: '', component: EventsSetDashboardComponent },
  { path: 'sets', component: EventsSetDashboardComponent },
  { path: 'catalog', component: EventsCatalogDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule { }