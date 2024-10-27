import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceDashboardComponent } from './pages/reference-dashboard/reference-dashboard.component';

const routes: Routes = [
    { path: '', component: ReferenceDashboardComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceRoutingModule {}