import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { ReinsuranceDashboardComponent } from './pages/reinsurance-dashboard/reinsurance-dashboard.component';
import { ReinsuranceRoutingModule } from './reinsurance-routing.module';

@NgModule({
    declarations: [
        ReinsuranceDashboardComponent
    ],
    imports: [
        CommonModule,  // Import CommonModule for Angular common directives
        ReinsuranceRoutingModule,  // Import the routing module for this feature
        NzTableModule,    // Import Ng-Zorro Table for the analyses table
        NzButtonModule,   // Import Ng-Zorro Button for actions like New, Copy, Delete
        NzInputModule,    // Import Ng-Zorro Input for search functionality
        NzSelectModule,   // Import Ng-Zorro Select for filters
        NzFormModule,     // Import Ng-Zorro Form for creating filters
        NzPageHeaderModule // For the header section
    ],
})
export class ReinsuranceModule { }