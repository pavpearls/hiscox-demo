import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LossesDashboardComponent } from './pages/losses-dashboard/losses-dashboard.component';
import { LossSetDashboardComponent } from './pages/loss-set-dashboard/loss-set-dashboard.component';

const routes: Routes = [
    { path: '', component: LossesDashboardComponent },
    { path: 'sets', component: LossSetDashboardComponent },
    { path: 'uploads', component: LossesDashboardComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossesRoutingModule {}