import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EVENT_SET_TABS } from '@events//config/events-catalog-dashboard-page.config';
import { EventsFacade } from '@events//store/events.facade';
import {
  Event,
  EventSet,
  EventSetAndEventsRequest,
  EventSetMember,
} from '@shared/api-services/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { filterSuccess, RemoteData } from 'ngx-remotedata';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-set-dashboard.component.html',
  styleUrls: ['./events-set-dashboard.component.scss'],
})
export class EventsSetDashboardComponent implements OnInit {
  eventSetList$: Observable<RemoteData<any[], HttpErrorResponse>> =
    this.eventsFacade.state.eventSets.getEventSetList$;


  eventSetData: any[] = [];
  eventSetRawData: any[] = [];
  tabs = EVENT_SET_TABS;
  selectedTabId = 1; // e.g. RDS
  editedEventSet: EventSet | null = null;
  deletedEventSet: EventSet | null = null;
  isAddEventSetModalVisible = false;
  isEditEventSetModalVisible = false;
  isDeleteModalVisible = false;
  selectedEventSetEvents: any[];

  constructor(private eventsFacade: EventsFacade, private modal: NzModalService,) { }

  ngOnInit(): void {
    this.eventsFacade.actions.eventSetMemberships.getMembershipList();
    this.eventsFacade.actions.eventSets.getEventSetList();
    
    this.populateEventSetData();

    this.eventSetList$.subscribe((data: any) => {
      this.eventSetRawData = data.value;
      this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    });



    this.eventsFacade.state.eventSets.deleteEventSet$
      .pipe(filterSuccess())
      .subscribe(() => {
        this.populateEventSetData();
      });

    this.eventsFacade.state.eventSetMemberships.addEventsToEventSet$
      .pipe(filterSuccess())
      .subscribe(() => {
        this.populateEventSetData();
     });

     
    this.eventsFacade.state.eventSetMemberships.deleteEventsFromEventSet$
    .pipe(filterSuccess())
    .subscribe(() => {
      this.populateEventSetData();
    });


    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
  }

  filterBySelectedTab(dataList: any[]): any[] {
    return dataList
      ? dataList.filter((d) => d.eventSetTypeID === this.selectedTabId)
      : [];
  }

  populateEventSetData() {
    this.eventsFacade.actions.eventSets.getEventSetList();
   
    this.eventsFacade.showLoadingSpinnerForApiResponses(
      this.eventsFacade.state.eventSets.getEventSetList$,
      this.eventsFacade.state.events.eventsTypeList$,
      this.eventsFacade.state.eventSets.createEventSetAndEvents$,      
      this.eventsFacade.state.eventSetMemberships.membershipList$,
      this.eventsFacade.state.eventSetMemberships.updateMembership$,
      this.eventsFacade.state.eventSetMemberships.addEventsToEventSet$,
      this.eventsFacade.state.eventSetMemberships.deleteEventsFromEventSet$,
      this.eventsFacade.state.eventSets.updateEventSet$,
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;
    this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
    this.eventsFacade.actions.eventSets.getEventSetById(this.selectedTabId);
    this.eventsFacade.actions.eventSets.getEventSetList();
  }

  handleOnDeleteEventSet(eventSets: EventSet[]): void {
    this.deletedEventSet = eventSets[0];
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete the selected Event Set?',
      nzContent: `${eventSets[0].eventSetName}  will be deleted.`,
      nzOnOk: () => {
        if (eventSets[0].eventSetID) {
          this.eventsFacade.actions.eventSets.deleteEventSet(eventSets[0].eventSetID);
        }
      },
    });
  }

  handleEditEvent($event: any): void {
    this.editedEventSet = $event;
    this.showEditEventSetModal();
  }

  handleOnNewEvent($event: any): void {
    this.showAddEventSetModal();
  }

  showAddEventSetModal(): void {
    this.isAddEventSetModalVisible = true;
  }
  showEditEventSetModal(): void {
    this.isEditEventSetModalVisible = true;
  }

  onModalOk($event: any): void {
    this.eventsFacade.actions.eventSets.createEventSetAndEvents($event);
    this.isAddEventSetModalVisible = false;
  }

  onModalCancel(): void {
    this.isAddEventSetModalVisible = false;
    this.isDeleteModalVisible = false;
    this.isEditEventSetModalVisible = false;
  }

  onEditEventSetModalOk($payload: any) {
    this.eventsFacade.actions.eventSets.updateEventSet($payload);
    this.isEditEventSetModalVisible = false;
    this.editedEventSet = null;
  }

  onEditEventSetModalCancel($event: any) {
    this.isEditEventSetModalVisible = false;
  }

}
