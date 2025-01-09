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
  selectedTabId = 1; // e.g. RDS
  editedEventSet: EventSet | null = null;
  deletedEventSet: EventSet | null = null;
  isAddEventSetModalVisible = false;
  isEditEventSetModalVisible = false;
  isDeleteModalVisible = false;

  constructor(private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.populateEventSetData();

    // Subscribe to event sets from store
    this.eventSetList$.subscribe((data: any) => {
      this.eventSetRawData = data.value;
      // Make a fresh copy to avoid read-only issues
      this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    });

    // Reload after deletes
    this.eventsFacade.state.eventSets.deleteEventSet$
      .pipe(filterSuccess())
      .subscribe(() => {
        this.populateEventSetData();
      });

    // Reload after updates
    this.eventsFacade.state.eventSets.updateEventSet$
      .pipe(filterSuccess())
      .subscribe(() => {
        this.eventsFacade.actions.eventSets.getEventSetList();
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
      this.eventsFacade.state.eventSets.createEventSetAndEvents$
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;
    this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    this.eventsFacade.actions.events.setActiveTab(this.selectedTabId.toString());
  }

  // Called when user clicks "Delete" in child
  handleOnDeleteEventSet(eventSets: EventSet[]): void {
    this.isDeleteModalVisible = true;
    this.deletedEventSet = eventSets[0];
  }

  // Called when user clicks "Edit" in child
  handleEditEvent($event: any): void {
    this.editedEventSet = $event;
    this.showEditEventSetModal();
  }

  // Called when user clicks "New" in child
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
    // Implementation for creating new EventSet, same as before
  }

  onModalCancel(): void {
    this.isAddEventSetModalVisible = false;
    this.isDeleteModalVisible = false;
    this.isEditEventSetModalVisible = false;
  }

  // Handling the edit modal OK
  onEditEventSetModalOk($event: any) {
    // e.g. this.eventsFacade.actions.eventSets.updateEventSet( ... );
    this.isEditEventSetModalVisible = false;
    this.editedEventSet = null;
    this.eventsFacade.actions.eventSets.getEventSetList();
  }

  onEditEventSetModalCancel($event: any) {
    this.isEditEventSetModalVisible = false;
  }

  // Handling the delete modal confirm
  handleDeleteConfirmed(payload: { eventSetId: number; eventIds: number[] | null }): void {
    if (payload.eventIds === null) {
      // Entire event set
      this.eventsFacade.actions.eventSets.deleteEventSet(payload.eventSetId);
    } else {
      // Delete specific events
      if (this.deletedEventSet?.events) {
        const updatedEventSet = {
          ...this.deletedEventSet,
          events: this.deletedEventSet.events.filter(
            (evt) => !payload.eventIds?.includes(evt.eventID as any)
          ),
        };
        this.eventsFacade.actions.eventSets.updateEventSet(updatedEventSet);
      }
    }
    this.isDeleteModalVisible = false;
    this.deletedEventSet = null;
  }
}
