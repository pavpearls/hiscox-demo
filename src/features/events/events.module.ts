import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { EventsRoutingModule } from './events-routing.module';
import { EventsDashboardComponent } from './pages/events-dashboard/events-dashboard.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { RemoteDataModule } from 'ngx-remotedata';
import { StoreModule } from '@ngrx/store';
import { eventsReducer } from './store/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/events.effects';
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
        EventsTableComponent,

        StoreModule.forFeature('events', eventsReducer),
        EffectsModule.forFeature([EventsEffects]),
    ],
})
export class EventsModule { }