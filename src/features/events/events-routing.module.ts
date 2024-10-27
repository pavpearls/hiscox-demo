import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsDashboardComponent } from './pages/events-dashboard/events-dashboard.component';

const routes: Routes = [
    { path: '', component: EventsDashboardComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}