import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { EventsRoutingModule } from './events-routing.module';
import { EventsDashboardComponent } from './pages/events-dashboard/events-dashboard.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { RemoteDataModule } from 'ngx-remotedata';
import { AddEventFormComponent } from './components/add-event-form/add-event-form.component';
import { EventsTableComponent } from './components/events-table/events-table.component';

@NgModule({
    declarations: [
        EventsDashboardComponent,

        
    ],
    imports: [
        CommonModule,
        EventsRoutingModule,
        NzTableModule,
        NzButtonModule,
        NzInputModule,
        NzSelectModule,
        NzFormModule,
        NzDatePickerModule,
        NzPageHeaderModule,
        FormsModule,
        NzTabsModule,
        NzSpinModule,
        NzDividerModule,
        NzIconModule,
        NzCollapseModule,
        ReactiveFormsModule,
        RemoteDataModule,
        AddEventFormComponent,
        EventsTableComponent
    ],
})
export class EventsModule { }