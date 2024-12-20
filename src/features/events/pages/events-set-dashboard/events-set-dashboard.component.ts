import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CATALOG_ADD_EVENT_CONFIG, CATALOG_EVENTS_TABS, EVENT_SET_TABS } from '@events//config/events-catalog-dashboard-page.config';
import { EventsCatalogService } from '@events//services/events-catalog.service';
import { EventsFacade } from '@events//store/events.facade';
import { EventSet, EventSetAndEventsRequest, EventType, RegionPeril, Event } from '@shared/api-services/models';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filterSuccess, RemoteData } from 'ngx-remotedata';
import { combineLatest, Observable, take } from 'rxjs';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-set-dashboard.component.html',
  styleUrls: ['./events-set-dashboard.component.scss'],
})
export class EventsSetDashboardComponent implements OnInit {
  eventSetList$: Observable<RemoteData<any[], HttpErrorResponse>> = this.eventsFacade.state.eventSets. getEventSetList$;
  
  eventSetData : any[] = [];
  eventSetRawData : any[] = [];
  tabs = EVENT_SET_TABS;
  isComponentAlive = true;
  selectedTabId = 1 // RDS;
  public isAddEventSetModalVisible = false;

  constructor(private eventsFacade: EventsFacade,  private notification: NzNotificationService) {  }

  ngOnInit(): void {
    this.populateEventSetData();
    
    this.eventSetList$.subscribe((data: any) => {
      this.eventSetRawData = data.value;
      this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    })

    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
   
  }

  filterBySelectedTab(dataList: any[]) : any[] {
    return dataList ? dataList.filter(d=> d.eventSetTypeID === this.selectedTabId) : [];
  }

  populateEventSetData() {
    this.eventsFacade.actions.eventSets.getEventSetList();

    this.eventsFacade.showLoadingSpinnerForApiResponses(
      this.eventsFacade.state.eventSets.getEventSetList$,
      this.eventsFacade.state.events.eventsTypeList$,
      this.eventsFacade.state.eventSets.createEventSetAndEvents$
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;  
    this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
  }

  handleOnDeleteEventSet(eventSets: EventSet[]): void {
    if (eventSets[0] && eventSets[0].lossLoads && eventSets[0].lossLoads.length > 0) {
      this.notification.warning('Warning:', 'Cannot delete Event that has Gross Losses. Archive the Event to remove from the display.');
    }
    const eventSetID = eventSets[0].eventSetID as number;
    this.eventsFacade.actions.eventSets.deleteEventSet(eventSetID);
    this.populateEventSetData();
  }

  handleOnNewEvent($event: any): void {
    this.showAddEventSetModal();
  }

  showAddEventSetModal(): void {
    this.isAddEventSetModalVisible = true;
  }

  onModalOk($event: any): void {
    const { eventSetName, eventSetDescription, events, eventType }: { eventSetName: string; eventSetDescription: string; events: Event[], eventType: number } = $event;
    this.isAddEventSetModalVisible = false;
  
    this.eventsFacade.state.events.eventsByEventType$
      .pipe(take(1), filterSuccess())
      .subscribe((data) => {
        const originalEvents = [...data.value];
  
        const matchedEvents = events.map((event) => {
          const originalEvent = originalEvents.find((oe) => oe.eventID === event.eventID); 
          return originalEvent ? { ...originalEvent } : event;
        });
  
        const payload: EventSetAndEventsRequest = {
          eventSetID: undefined,
          eventSetTypeID: eventType,
          eventSetName,
          eventSetDescription,
          isArchived: false,
          createdBy: undefined,
          createDate: new Date(),
          eventRequests: [...matchedEvents],
        };
  
        this.eventsFacade.actions.eventSets.createEventSetAndEvents(payload);
      });
  }

  onModalCancel(): void {
    this.isAddEventSetModalVisible = false;
  }
}
