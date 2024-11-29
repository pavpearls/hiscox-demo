import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Import ng-zorro button module
import { NzFormModule } from 'ng-zorro-antd/form'; // Import ng-zorro form module
import { NzInputModule } from 'ng-zorro-antd/input'; // Import ng-zorro input module
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'; // Import ng-zorro page-header
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import ng-zorro select module
import { NzTableModule } from 'ng-zorro-antd/table'; // Import ng-zorro table module
import { LossesRoutingModule } from './losses-routing.module';
import { LossesDashboardComponent } from './pages/losses-dashboard/losses-dashboard.component';
import { UploadLossLoadModalComponent } from './components/upload-losses-modal/upload-losses-modal.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LossesDashboardComponent,
        UploadLossLoadModalComponent
    ],
    imports: [
        CommonModule,
        LossesRoutingModule,
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
        ReactiveFormsModule,
        FormsModule
    ],
})
export class LossesModule { }