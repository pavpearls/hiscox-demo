import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EVENT_SET_TABS } from '@events//config/events-catalog-dashboard-page.config';
import { EventsFacade } from '@events//store/events.facade';
import {
  LossSet,
} from '@shared/api-services/models';
import { LossFacade } from 'features/losses/store/losses.facade';
import { NzModalService } from 'ng-zorro-antd/modal';
import { filterSuccess, RemoteData } from 'ngx-remotedata';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-losss-dashboard',
  templateUrl: './loss-set-dashboard.component.html',
  styleUrls: ['./loss-set-dashboard.component.scss'],
})
export class LossSetDashboardComponent implements OnInit {
  lossSetList$: Observable<RemoteData<any[], HttpErrorResponse>> =
    this.lossFacade.state.lossSets.getLossSetFlatList$;


  lossSetData: any[] = [];
  lossSetRawData: any[] = [];
  tabs = EVENT_SET_TABS;
  selectedTabId = 1; // e.g. RDS
  editedLossSet: LossSet | null = null;
  deletedLossSet: LossSet | null = null;
  isAddLossSetModalVisible = false;
  isEditLossSetModalVisible = false;
  isDeleteModalVisible = false;
  selectedLossSetLoss: any[];

  constructor(private lossFacade: LossFacade, 
            private eventsFacade: EventsFacade, 
            private modal: NzModalService
          ) { }

  ngOnInit(): void {
    
    this.populateLossSetData();

    this.lossSetList$.subscribe((data: any) => {
      this.lossSetRawData = data.value;
      this.lossSetData = this.filterBySelectedTab(this.lossSetRawData);
    });


    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
  }

  filterBySelectedTab(dataList: any[]): any[] {
    return dataList
      ? dataList.filter((d) => d.eventSetTypeID === this.selectedTabId)
      : [];
  }

  populateLossSetData() {
    this.lossFacade.actions.lossSets.loadLossSetFlatList();
   
    this.lossFacade.showLoadingSpinnerForApiResponses(
      this.lossFacade.state.lossSets.getLossSetFlatList$,
      this.eventsFacade.state.events.eventsTypeList$,
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;
    this.lossSetData = this.filterBySelectedTab(this.lossSetRawData);
    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
  }

  showAddLossSetModal(): void {
    this.isAddLossSetModalVisible = true;
  }
  showEditLossSetModal(): void {
    this.isEditLossSetModalVisible = true;
  }

  onModalOk($loss: any): void {
    
  }

  onModalCancel(): void {
    this.isAddLossSetModalVisible = false;
    this.isDeleteModalVisible = false;
    this.isEditLossSetModalVisible = false;
  }

  onEditLossSetModalOk($payload: any) {
    this.isEditLossSetModalVisible = false;
    this.editedLossSet = null;
  }

  onEditLossSetModalCancel($loss: any) {
    this.isEditLossSetModalVisible = false;
  }

}
