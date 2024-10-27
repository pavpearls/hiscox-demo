import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AnalysesRoutingModule } from './analyses-routing.module'; // Routing module for lazy loading
import { AnalysesDashboardComponent } from './pages/analyses-dashboard/analyses-dashboard.component';
import { AnalysesDetailViewComponent } from './pages/analyses-detail-view/analyses-detail-view.component';
import { AnalysesFacade } from './store/analyses.facade';
import { analysesReducer } from './store/analyses.reducer';
import { RemoteDataModule } from 'ngx-remotedata';
import { AnalysesEffects } from './store/analyses.effects';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
    declarations: [
        AnalysesDashboardComponent, AnalysesDetailViewComponent
    ],
    imports: [
        CommonModule,  // Import CommonModule for Angular common directives
        AnalysesRoutingModule,  // Import the routing module for this feature
        NzTableModule,    // Import Ng-Zorro Table for the analyses table
        NzButtonModule,   // Import Ng-Zorro Button for actions like New, Copy, Delete
        NzInputModule,    // Import Ng-Zorro Input for search functionality
        NzSelectModule,   // Import Ng-Zorro Select for filters
        NzFormModule,     // Import Ng-Zorro Form for creating filters
        NzPageHeaderModule, // For the header section
        NzSpinModule,
        NzPaginationModule,
        NzButtonModule,
        NzIconModule,
        NzMenuModule,
        NzSelectModule,
        NzDropDownModule,
        
        StoreModule.forFeature('analyses', analysesReducer),
        EffectsModule.forFeature([AnalysesEffects]),
        RemoteDataModule
    ],
    providers: [AnalysesFacade]
})
export class AnalysesModule { }