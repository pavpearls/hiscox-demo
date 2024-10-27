import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReinsuranceDashboardComponent } from './pages/reinsurance-dashboard/reinsurance-dashboard.component';

const routes: Routes = [
    { path: '', component: ReinsuranceDashboardComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReinsuranceRoutingModule {}