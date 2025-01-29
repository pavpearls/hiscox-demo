import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { RemoteDataModule } from 'ngx-remotedata';
import { AddNewLossSetModalComponent } from './components/add-new-loss-set-modal/add-new-loss-set-modal.component';
import { UploadLossLoadModalComponent } from './components/upload-losses-modal/upload-losses-modal.component';
import { LossesRoutingModule } from './losses-routing.module';
import { LossSetDashboardComponent } from './pages/loss-set-dashboard/loss-set-dashboard.component';
import { LossesDashboardComponent } from './pages/losses-dashboard/losses-dashboard.component';
import { LossEffects } from './store/losses.effects';
import { lossReducer } from './store/losses.reducer';
import { LossSetTableComponent } from './components/loss-set-table/loss-set-table.component';
import { EditLossSetModalComponent } from './components/edit-loss-set-modal/edit-loss-set-modal.component';

const GLOBAL_STATE_AND_THIRD_PARTY_MODULES = [
  RemoteDataModule,
  StoreModule.forFeature('loss', lossReducer),
  EffectsModule.forFeature([LossEffects]),
];

const MODULE_ROUTING = [LossesRoutingModule];

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
  NzModalModule,
  NzPaginationModule,
  NzUploadModule,
];

const ANGULAR_CORE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];


const MODULE_COMPONENTS = [
  LossesDashboardComponent,
  UploadLossLoadModalComponent,
  LossSetDashboardComponent,
  AddNewLossSetModalComponent,
  LossSetTableComponent,
  EditLossSetModalComponent
];

@NgModule({
  declarations: [...MODULE_COMPONENTS],
  imports: [
      AgGridModule,
    ...ANGULAR_CORE_MODULES,
    ...NG_ZORRO_MODULES,
    ...GLOBAL_STATE_AND_THIRD_PARTY_MODULES,
    ...MODULE_ROUTING,
  ],
})
export class LossesModule {}
