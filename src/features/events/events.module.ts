import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { EventsDashboardComponent } from './pages/events-dashboard/events-dashboard.component';
import { EventsRoutingModule } from './events-routing.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
    declarations: [
        EventsDashboardComponent
    ],
    imports: [
        CommonModule,  // Import CommonModule for Angular common directives
        EventsRoutingModule,  // Import the routing module for this feature
        NzTableModule,    // Import Ng-Zorro Table for the analyses table
        NzButtonModule,   // Import Ng-Zorro Button for actions like New, Copy, Delete
        NzInputModule,    // Import Ng-Zorro Input for search functionality
        NzSelectModule,   // Import Ng-Zorro Select for filters
        NzFormModule,
        NzDatePickerModule ,     // Import Ng-Zorro Form for creating filters
        NzPageHeaderModule,
        FormsModule,
    NzSpinModule,
        
        
        // For the header section
    ],
})
export class EventsModule { }