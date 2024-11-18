import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RemoteDataModule } from 'ngx-remotedata';

import { AddEventFormComponent } from './components/add-event-form/add-event-form.component';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { EventsRoutingModule } from './events-routing.module';
import { EventsCatalogDashboardComponent } from './pages/events-catalog-dashboard/events-catalog-dashboard.component';
import { EventsSetDashboardComponent } from './pages/events-set-dashboard/events-set-dashboard.component';
import { AddEventFormService } from './services/add-event-form.service';
import { EventsEffects } from './store/events.effects';
import { eventsReducer } from './store/events.reducer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { EventsCatalogService } from './services/events-catalog.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NestedTableComponent } from './components/set-events-table/set-events-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';

const ANGULAR_CORE_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
];

const NG_ZORRO_MODULES = [
    NzButtonModule,
    NzDatePickerModule,
    NzDividerModule,
    NzFormModule,
    NzInputModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzSpinModule,
    NzTableModule,
    NzTabsModule,
    NzIconModule,
    NzCollapseModule,
    NzBadgeModule,
    NzDropDownModule,
    NzFlexModule, 
    NzGridModule,
    NzCheckboxModule,
    NzModalModule
    
];

const GLOBAL_STATE_AND_THIRD_PARTY_MODULES = [
    RemoteDataModule,
    StoreModule.forFeature('events', eventsReducer),
    EffectsModule.forFeature([EventsEffects])
];

const MODULE_ROUTING = [
    EventsRoutingModule,
];

const MODULE_BUSINESS_LOGIC_SERVICES = [
    AddEventFormService,
    EventsCatalogService
]

const MODULE_PAGES = [
    EventsSetDashboardComponent,
    EventsCatalogDashboardComponent
]

// Documentation purposes only
const MODULE_REUSABLE_STANDALONE_COMPONENTS = [
    // EventsTableComponent,
    AddEventFormComponent
]

@NgModule({
    declarations: [
        ...MODULE_PAGES,
        EventsTableComponent,
        NestedTableComponent
    ],
    imports: [
        AgGridModule,
        ...ANGULAR_CORE_MODULES,
        ...NG_ZORRO_MODULES,
        ...GLOBAL_STATE_AND_THIRD_PARTY_MODULES,
        ...MODULE_ROUTING,
        ...MODULE_REUSABLE_STANDALONE_COMPONENTS
    ],
    providers: [
        ...MODULE_BUSINESS_LOGIC_SERVICES
    ]
})
export class EventsModule { }