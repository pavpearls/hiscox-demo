import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filterSuccess, isFailure, isInProgress, isSuccess, RemoteData } from 'ngx-remotedata';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CATALOG_ADD_EVENT_CONFIG, CATALOG_ADD_EVENT_PANEL, CATALOG_EVENTS_TABS, CATALOG_TABLE_PANEL } from '../../config/events-catalog-dashboard-page.config';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';
import { EventsCatalogService } from '../../services/events-catalog.service';
import { EventsFacade } from '../../store/events.facade';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '../../../../shared/api-services/nds-api/generated/model/event';

@Component({
  selector: 'app-events-catalog-dashboard',
  templateUrl: './events-catalog-dashboard.component.html',
  styleUrls: ['./events-catalog-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsCatalogDashboardComponent implements OnInit {
  eventsTypeList$ = this.eventsFacade.eventsTypeList$;
  regionPerilList$ = this.eventsFacade.regionPerilList$;
  industryLossList$ = this.eventsFacade.industryLossList$;
  hiscoxImpactList$ = this.eventsFacade.hiscoxImpactList$;

  eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> = this.eventsFacade.eventsByEventType$;

  selectedTab = '';
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;
  expandIconPosition: 'start' | 'end' = 'end';

  columns: EventColumnItem[] = [];
  data: EventDataItem[] = [];

  tabs = CATALOG_EVENTS_TABS;
  panels = CATALOG_ADD_EVENT_PANEL;
  panelsTable = CATALOG_TABLE_PANEL;

  vm$: Observable<{ loading: boolean; error: boolean; success: boolean }> = combineLatest([
    this.eventsTypeList$,
    this.regionPerilList$,
    this.industryLossList$,
    this.hiscoxImpactList$
  ]).pipe(
    map(([eventsTypeData, regionPerilData, industryLossData, hiscoxImpactData]) => ({
      loading: [eventsTypeData, regionPerilData, industryLossData, hiscoxImpactData].some(data => isInProgress(data)),
      error: [eventsTypeData, regionPerilData, industryLossData, hiscoxImpactData].some(data => isFailure(data)),
      success: [eventsTypeData, regionPerilData, industryLossData, hiscoxImpactData].every(data => isSuccess(data))
    }))
  );

  constructor(
    private eventsFacade: EventsFacade,
    private eventsCatalogService: EventsCatalogService
  ) { }

  ngOnInit(): void {
    this.loadCatalogDashboardPageData();


    this.eventList$.pipe(
      filterSuccess()
    ).subscribe(response => {
      this.data = response.value.map(this.transformEventDataItem);
      this.columns = this.generateColumns(response.value[0]);
    });
  }

  private generateColumns(item: Event): EventColumnItem[] {
    return [
      {
        name: 'Event ID',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => a.eventId - b.eventId,
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Event Type',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => a.eventType.localeCompare(b.eventType),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('eventType'),
        filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.eventType)
      },
      {
        name: 'Event Name',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => a.eventName.localeCompare(b.eventName),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('eventName'),
        filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.eventName)
      },
      {
        name: 'Region-Peril',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => a.regionPeril.localeCompare(b.regionPeril),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: this.generateFilterList('regionPeril'),
        filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.regionPeril)
      },
      {
        name: 'Created By',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => a.createdBy.localeCompare(b.createdBy),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Created Date',
        sortOrder: null,
        sortFn: (a: EventDataItem, b: EventDataItem) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Restricted',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
        filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.restricted)
      },
      {
        name: 'Archived',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
        filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.archived)
      }
    ];
  }

  private transformEventDataItem(item: Event): EventDataItem {
    return {
      eventId: item?.eventID as any,
      eventType: item.eventType?.eventTypeName ?? '<No Data>',
      eventName: item.eventNameShort ?? '<No Data>',
      regionPeril: item.regionPeril?.regionPerilName ?? '<No Data>',
      createdBy: item.createUser?.userName ?? '<No Data>',
      createdDate: item.createDate ? new Date(item.createDate).toLocaleDateString('en-GB') : '<No Date>',
      restricted: item.isRestrictedAccess ? 'Yes' : 'No',
      archived: item.isArchived ? 'Yes' : 'No'
    };
  }

  private generateFilterList(field: keyof EventDataItem): { text: string, value: string }[] {
    const uniqueValues = [...new Set(this.data.map(item => item[field]))];
    return uniqueValues.map((value: any) => ({ text: value.toString() as any, value }));
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
      this.eventsTypeList$.pipe(filterSuccess())
    ])
      .pipe(take(1))
      .subscribe(([regionPerilList, hiscoxImpactList, industryLossList, eventsTypeList]) => {
        this.addEventConfig = this.eventsCatalogService.prepareAddEventConfig(
          this.addEventConfig,
          regionPerilList.value,
          hiscoxImpactList.value,
          industryLossList.value,
          eventsTypeList.value,
          this.selectedTab
        );

        if (this.addEventConfig.eventTypeId) {
          this.eventsFacade.loadEventsByEventType({ eventTypeId: this.addEventConfig.eventTypeId });
        }
      });
  }

  handleEventAdded(event: any): void {
    const events = this.eventsCatalogService.generateEvents(event);
    events.forEach(newEvent => {
      this.eventsFacade.addNewEvent(newEvent);
    });
  }
}
