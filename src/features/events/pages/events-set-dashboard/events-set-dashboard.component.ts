import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EVENT_SET_TABS } from '@events//config/events-catalog-dashboard-page.config';
import { EventsFacade } from '@events//store/events.facade';
import {
  Event,
  EventSet,
  EventSetAndEventsRequest,
} from '@shared/api-services/models';
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
  isComponentAlive = true;
  selectedTabId = 1; // RDS;
  editedEventSet: EventSet | null = null;
  editedEventSetData = null;
  deletedEventSet: EventSet | null = null;
  public isAddEventSetModalVisible = false;
  public isEditEventSetModalVisible = false;
  public isDeleteModalVisible = false;
  constructor(private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.populateEventSetData();

    this.eventSetList$.subscribe((data: any) => {
      this.eventSetRawData = data.value;
      this.eventSetData = [...this.filterBySelectedTab(this.eventSetRawData)];
    });

    this.eventsFacade.state.eventSets.deleteEventSet$
      .pipe(filterSuccess())
      .subscribe(() => {
        this.populateEventSetData();
      });

    this.eventsFacade.actions.events.setActiveTab(
      this.selectedTabId.toString()
    );

    this.eventsFacade.state.eventSets.updateEventSet$.pipe(filterSuccess())
    .subscribe(() => {
      this.eventsFacade.actions.eventSets.getEventSetList();
    });

    this.eventsFacade.state.eventSets.deleteEventSet$.pipe(filterSuccess())
    .subscribe(() => {
      this.eventsFacade.actions.eventSets.getEventSetList();
    });
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
      this.eventsFacade.state.eventSets.createEventSetAndEvents$
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;
    this.eventSetData = [...this.filterBySelectedTab(this.eventSetRawData)];
    this.eventSetData[0].
    
    this.eventsFacade.actions.events.setActiveTab(
      this.selectedTabId.toString()
    );
  }

  handleOnDeleteEventSet(eventSets: EventSet[]): void {
    debugger;
    this.isDeleteModalVisible = true;
    this.deletedEventSet = eventSets[0];
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
    const {
      eventSetName,
      eventSetDescription,
      events,
      eventType,
    }: {
      eventSetName: string;
      eventSetDescription: string;
      events: Event[];
      eventType: number;
    } = $event;
    this.isAddEventSetModalVisible = false;

    this.eventsFacade.state.events.eventsByEventType$
      .pipe(take(1), filterSuccess())
      .subscribe((data) => {
        const originalEvents = [...data.value];

        const matchedEvents = events.map((event) => {
          const originalEvent = originalEvents.find(
            (oe) => oe.eventID === event.eventID
          );
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
    this.isDeleteModalVisible = false;
    this.isEditEventSetModalVisible = false;
  }

  onEditEventSetModalOk($event: any) {
    const {eventSetName, eventSetDescription, eventRequests} = $event;
    const updatedEventSet = {
      ...this.editedEventSet,
      events: [...eventRequests],
      eventSetName,
      eventSetDescription
    };
    
    this.eventsFacade.actions.eventSets.updateEventSet(updatedEventSet);
    this.isEditEventSetModalVisible = false;
    this.editedEventSet = null;

    this.eventsFacade.actions.eventSets.getEventSetList();
  }

  onEditEventSetModalCancel($event: any) {
    this.isEditEventSetModalVisible = false;
  }

  handleDeleteConfirmed(payload: {
    eventSetId: number;
    eventIds: number[] | null;
  }): void {
    if (payload?.eventIds?.length === this.deletedEventSet?.events?.length) {
      // Delete entire event set
      this.eventsFacade.actions.eventSets.deleteEventSet(payload.eventSetId);
    } else {
      if (this.deletedEventSet?.events) {
        // Delete specifc events
        const updatedEventSet = {
          ...this.deletedEventSet,
          events: this.deletedEventSet?.events?.filter(
            (event) => !payload.eventIds?.includes(event?.eventID as any)
          ),
        };
        this.eventsFacade.actions.eventSets.updateEventSet(updatedEventSet);
      }
    }

    this.isDeleteModalVisible = false;
    this.deletedEventSet = null;
  }
}
