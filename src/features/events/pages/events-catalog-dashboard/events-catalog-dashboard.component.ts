import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  filterFailure,
  filterSuccess,
  isFailure,
  isInProgress,
  isSuccess,
  RemoteData,
} from 'ngx-remotedata';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import {
  CATALOG_ADD_EVENT_CONFIG,
  CATALOG_ADD_EVENT_PANEL,
  CATALOG_EVENTS_TABS,
  CATALOG_TABLE_PANEL,
} from '../../config/events-catalog-dashboard-page.config';
import {
  EventColumnItem,
  EventDataItem,
} from '../../interfaces/events.interfaces';
import { EventsCatalogService } from '../../services/events-catalog.service';
import { EventsFacade } from '../../store/events.facade';
import { HttpErrorResponse } from '@angular/common/http';
import { EventType, RegionPeril, Event } from '@shared/api-services/models';

@Component({
  selector: 'app-events-catalog-dashboard',
  templateUrl: './events-catalog-dashboard.component.html',
  styleUrls: ['./events-catalog-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzNotificationService]
})
export class EventsCatalogDashboardComponent implements OnInit, OnDestroy {
  eventsTypeList$: Observable<RemoteData<EventType[], HttpErrorResponse>> = this.eventsFacade.state.events.eventsTypeList$;
  regionPerilList$: Observable<RemoteData<RegionPeril[], HttpErrorResponse>> = this.eventsFacade.state.events.regionPerilList$;
  industryLossList$: Observable<RemoteData<number[], HttpErrorResponse>> = this.eventsFacade.state.events.industryLossList$;
  hiscoxImpactList$: Observable<RemoteData<string[], HttpErrorResponse>> = this.eventsFacade.state.events.hiscoxImpactList$;
  addEvent$: Observable<RemoteData<Event, HttpErrorResponse>> = this.eventsFacade.state.events.addEvent$;
  deleteEvent$: Observable<RemoteData<number, HttpErrorResponse>> = this.eventsFacade.state.events.deleteEvent$;
  updateEvent$: Observable<RemoteData<Event, HttpErrorResponse>> = this.eventsFacade.state.events.updateEvent$;

  eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> = this.eventsFacade.state.events.eventsByEventType$.pipe(filterSuccess());
  selectedTab$:Observable<string> = this.eventsFacade.state.events.activeTab$;

  addEventConfig = CATALOG_ADD_EVENT_CONFIG;
  expandIconPosition: 'start' | 'end' = 'end';

  columns: EventColumnItem[] = [];
  data: EventDataItem[] = [];

  tabs = CATALOG_EVENTS_TABS;
  panels = CATALOG_ADD_EVENT_PANEL;
  panelsTable = CATALOG_TABLE_PANEL;

  enableRowSelection = true;

  isComponentAlive = true;

  vm$: Observable<{ loading: boolean; error: boolean; success: boolean }> =
    combineLatest([
      this.eventsTypeList$,
      this.regionPerilList$,
      this.industryLossList$,
      this.hiscoxImpactList$,
    ]).pipe(
      map(
        ([
          eventsTypeData,
          regionPerilData,
          industryLossData,
          hiscoxImpactData,
        ]) => ({
          loading: [
            eventsTypeData,
            regionPerilData,
            industryLossData,
            hiscoxImpactData,
          ].some((data) => isInProgress(data)),
          error: [
            eventsTypeData,
            regionPerilData,
            industryLossData,
            hiscoxImpactData,
          ].some((data) => isFailure(data)),
          success: [
            eventsTypeData,
            regionPerilData,
            industryLossData,
            hiscoxImpactData,
          ].every((data) => isSuccess(data)),
        })
      )
    );

  constructor(
    private eventsFacade: EventsFacade,
    private eventsCatalogService: EventsCatalogService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.loadCatalogDashboardPageData();
    this.loadEventsOnAddNewEvent();
    this.setDashboardFilterOptions();
    this.setActiveTab(CATALOG_EVENTS_TABS[0].key);
  }

  loadCatalogDashboardPageData(): void {
    this.eventsFacade.actions.events.loadRegionPerilList();
    this.eventsFacade.actions.events.loadEventTypeList();
    this.eventsFacade.actions.events.loadHiscoxImpactList();
    this.eventsFacade.actions.events.loadIndustryLossList();

    this.eventsFacade.showLoadingSpinnerForApiResponses(
      this.eventsFacade.state.events.eventsTypeList$,
      this.eventsFacade.state.events.regionPerilList$,
      this.eventsFacade.state.events.industryLossList$,
      this.eventsFacade.state.events.hiscoxImpactList$,
      this.eventsFacade.state.events.addEvent$,
      this.eventsFacade.state.events.deleteEvent$,
      this.eventsFacade.state.events.eventsByEventType$
    );
  }

  setActiveTab(tab: string): void {
    this.eventsFacade.actions.events.setActiveTab(tab);
  }

  setDashboardFilterOptions(): void {
    combineLatest([
      this.regionPerilList$.pipe(filterSuccess()),
      this.hiscoxImpactList$.pipe(filterSuccess()),
      this.industryLossList$.pipe(filterSuccess()),
      this.eventsTypeList$.pipe(filterSuccess()),
      this.selectedTab$
    ])
      .subscribe(
        ([
          regionPerilList,
          hiscoxImpactList,
          industryLossList,
          eventsTypeList,
          selectedTab
        ]) => {
          this.addEventConfig = {
            ...this.eventsCatalogService.prepareAddEventConfig(
              this.addEventConfig,
              regionPerilList.value,
              hiscoxImpactList.value,
              industryLossList.value,
              eventsTypeList.value,
              selectedTab
            ),
          };

          if (this.addEventConfig.eventTypeId) {
            this.eventsFacade.actions.events.loadEventsByEventType({
              eventTypeId: this.addEventConfig.eventTypeId,
            });
          }
        }
      );
  }

  loadEventsOnAddNewEvent(): void {
    this.addEvent$
      .pipe(filterSuccess())
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => {
        this.eventsFacade.actions.events.loadEventsByEventType({
          eventTypeId: this.addEventConfig.eventTypeId,
        });
      });
  }

  handleEventAdded(event: any): void {
    const events = this.eventsCatalogService.generateEvents(event, this.addEventConfig);
    events.forEach((newEvent) => {
      this.eventsFacade.actions.events.addNewEvent(newEvent);
    });
  }

  handleOnCopyEvent($event: any) {
    this.notification.warning('No API', 'Copy event functionality not supported - no api developed yet');
  }

  handleOnDeleteEvent(events: Event[]): void {
    if (!events.length) {
      this.notification.warning('No Events Selected', 'Please select an event to delete.');
      return;
    }
  
    const eventID = events[0].eventID as number;
    this.eventsFacade.actions.events.deleteEvent(eventID);
  }

  handleOnArchiveEvent(events: Event[]) {
    if (!events.length) {
      this.notification.warning('No Events Selected', 'Please select an event to archive.');
      return;
    }

    if (events[0].isArchived) {
      this.notification.info(
        'Event Already Archived',
        `Selected event is already archived.`
      );
      return;
    }
  
    this.eventList$.pipe(take(1)).subscribe((data: any) => {
      const events: Event[] = data.value;
      const eventToUpdate = events.find(x =>x.eventID === events[0].eventID);
      if (eventToUpdate) {
        const archivedEvent = {...eventToUpdate, isArchived: true }
        this.eventsFacade.actions.events.updateEvent(archivedEvent);
      }
    })
  }

  handleOnEditEvent(editedEvent: any): void {
    this.eventList$.pipe(take(1)).subscribe((data: any) => {
      const events: Event[] = data.value;
  
      const originalEvent = events.find(event => event.eventID === editedEvent.eventID);
  
      if (originalEvent) {
        const updatedEvent = {
          ...originalEvent,
          ...this.patchEditedValues(originalEvent, editedEvent),
        };
        this.eventsFacade.actions.events.updateEvent(updatedEvent);
      } else {
        console.warn('Original event not found for update');
      }
    });
  }

  private patchEditedValues(originalEvent: Event, editedEvent: any): Partial<Event> {

    const regionPeril = this.addEventConfig.regionPerilOptions.find(x =>x.displayValue === editedEvent.regionPerilName);

    return {
      eventNameShort: editedEvent.eventNameShort,
      regionPerilID: Number(regionPeril?.actualValue),
      industryLossEstimate: Number(editedEvent.industryLossEstimate),
      hiscoxLossImpactRating: editedEvent.hiscoxLossImpactRating,
      isArchived: editedEvent.archived === 'Yes',
      isRestrictedAccess: editedEvent.restricted === 'Yes',
    };
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}
