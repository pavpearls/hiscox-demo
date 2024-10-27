import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysesDashboardComponent } from './pages/analyses-dashboard/analyses-dashboard.component';
import { AnalysesDetailViewComponent } from './pages/analyses-detail-view/analyses-detail-view.component';

const routes: Routes = [
    { path: '', component: AnalysesDashboardComponent },
    { path: 'detail/:id', component: AnalysesDetailViewComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysesRoutingModule {}