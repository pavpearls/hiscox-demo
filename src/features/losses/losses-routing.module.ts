import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LossesDashboardComponent } from './pages/losses-dashboard/losses-dashboard.component';
import { LossSetsDashboardComponent } from './pages/loss-sets-dashboard/loss-sets-dashboard.component';

const routes: Routes = [
    { path: '', component: LossesDashboardComponent },
    { path: 'sets', component: LossSetsDashboardComponent },
    { path: 'uploads', component: LossesDashboardComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossesRoutingModule {}