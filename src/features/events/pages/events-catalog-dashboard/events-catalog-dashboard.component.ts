import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  filterSuccess,
  isFailure,
  isInProgress,
  isSuccess,
  RemoteData,
} from 'ngx-remotedata';
import { combineLatest, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { Event } from '../../../../shared/api-services/nds-api/generated/model/event';
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

@Component({
  selector: 'app-events-catalog-dashboard',
  templateUrl: './events-catalog-dashboard.component.html',
  styleUrls: ['./events-catalog-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsCatalogDashboardComponent implements OnInit, OnDestroy {
  eventsTypeList$ = this.eventsFacade.eventsTypeList$;
  regionPerilList$ = this.eventsFacade.regionPerilList$;
  industryLossList$ = this.eventsFacade.industryLossList$;
  hiscoxImpactList$ = this.eventsFacade.hiscoxImpactList$;
  addEvent$ = this.eventsFacade.addEvent$;

  eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> =
    this.eventsFacade.eventsByEventType$.pipe(filterSuccess());

  selectedTab = '';
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;
  expandIconPosition: 'start' | 'end' = 'end';

  columns: EventColumnItem[] = [];
  data: EventDataItem[] = [];

  tabs = CATALOG_EVENTS_TABS;
  panels = CATALOG_ADD_EVENT_PANEL;
  panelsTable = CATALOG_TABLE_PANEL;

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
    private eventsCatalogService: EventsCatalogService
  ) {}

  ngOnInit(): void {
    this.loadCatalogDashboardPageData();
    this.loadEventsOnAddNewEvent();
  }

  loadCatalogDashboardPageData(): void {
    this.eventsFacade.loadRegionPerilList();
    this.eventsFacade.loadEventTypeList();
    this.eventsFacade.loadHiscoxImpactList();
    this.eventsFacade.loadIndustryLossList();
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
    this.setDashboardFilterOptions();
  }

  setDashboardFilterOptions(): void {
    combineLatest([
      this.regionPerilList$.pipe(filterSuccess()),
      this.hiscoxImpactList$.pipe(filterSuccess()),
      this.industryLossList$.pipe(filterSuccess()),
      this.eventsTypeList$.pipe(filterSuccess()),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          regionPerilList,
          hiscoxImpactList,
          industryLossList,
          eventsTypeList,
        ]) => {
          this.addEventConfig = this.eventsCatalogService.prepareAddEventConfig(
            this.addEventConfig,
            regionPerilList.value,
            hiscoxImpactList.value,
            industryLossList.value,
            eventsTypeList.value,
            this.selectedTab
          );

          if (this.addEventConfig.eventTypeId) {
            this.eventsFacade.loadEventsByEventType({
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
        this.eventsFacade.loadEventsByEventType({
          eventTypeId: this.addEventConfig.eventTypeId,
        });
      });
  }

  handleEventAdded(event: any): void {
    const events = this.eventsCatalogService.generateEvents(event);
    events.forEach((newEvent) => {
      this.eventsFacade.addNewEvent(newEvent);
    });
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}
