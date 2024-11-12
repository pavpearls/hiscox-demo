import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filterSuccess, isFailure, isInProgress, isSuccess, RemoteData } from 'ngx-remotedata';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CATALOG_ADD_EVENT_CONFIG, CATALOG_ADD_EVENT_PANEL, CATALOG_EVENTS_TABS, CATALOG_TABLE_PANEL } from '../../config/events-catalog-dashboard-page.config';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';
import { MOCK_EVENT_DATA, MOCK_EVENT_TABLE_COLUMNS } from '../../mocks/mock-events-table-data';
import { EventsCatalogService } from '../../services/events-catalog.service';
import { EventsFacade } from '../../store/events.facade';
import { HttpErrorResponse } from '@angular/common/http';

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

  eventList$ = of(MOCK_EVENT_DATA);

  selectedTab = '';
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;
  expandIconPosition: 'start' | 'end' = 'end';

  columns: EventColumnItem[] = MOCK_EVENT_TABLE_COLUMNS;
  data: any[] = [];

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
  
    // Directly map mock data without conditional success checks
    this.eventList$.pipe(
      map((response: EventDataItem[]) => ({
        data: response.map(this.transformEventDataItem),
        columns: this.generateColumns(response[0]) // Generate columns dynamically based on the first item if available
      }))
    ).subscribe(({ data, columns }) => {
      console.log('data:', JSON.stringify(data));
      console.log('columns:', JSON.stringify(columns));
      this.columns = columns;
      this.data = data;
    });
  }

  private generateColumns(item: any): any[] {
    return [
      {
        name: 'Event ID',
        sortFn: (a: { eventId: number }, b: { eventId: number }) => a.eventId - b.eventId,
        filterMultiple: false,
      },
      {
        name: 'Event Type',
        sortFn: (a: { eventType: string }, b: { eventType: string }) => a.eventType.localeCompare(b.eventType),
        filterMultiple: true,
        listOfFilter: [...new Set(this.data.map((item: any) => item.eventType))].map(value => ({ text: value, value })),
        filterFn: (filter: string[], item: any) => filter.includes(item.eventType),
      },
      {
        name: 'Event Name',
        sortFn: (a: { eventName: string }, b: { eventName: string }) => a.eventName.localeCompare(b.eventName),
        filterMultiple: true,
        listOfFilter: [...new Set(this.data.map((item: any) => item.eventName))].map(value => ({ text: value, value })),
        filterFn: (filter: string[], item: any) => filter.includes(item.eventName),
      },
      {
        name: 'Region-Peril',
        sortFn: (a: { regionPeril: string }, b: { regionPeril: string }) => a.regionPeril.localeCompare(b.regionPeril),
        filterMultiple: true,
        listOfFilter: [...new Set(this.data.map((item: any) => item.regionPeril))].map(value => ({ text: value, value })),
        filterFn: (filter: string[], item: any) => filter.includes(item.regionPeril),
      },
      {
        name: 'Created By',
        sortFn: (a: { createdBy: string }, b: { createdBy: string }) => a.createdBy.localeCompare(b.createdBy),
        filterMultiple: false,
      },
      {
        name: 'Created Date',
        sortFn: (a: { createdDate: Date | string | number }, b: { createdDate: Date | string | number }) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        filterMultiple: false,
      },
      {
        name: 'Restricted',
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
      },
      {
        name: 'Archived',
        filterMultiple: true,
        listOfFilter: [{ text: 'Yes', value: 'Yes' }, { text: 'No', value: 'No' }],
      },
    ].map((col) => ({
      ...col,
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      filterFn: col.listOfFilter
        ? (filter: string[], item: any) => filter.includes(item[this.mapColumnNameToField(col.name)])
        : null,
    }));
  }

  private transformEventDataItem(item: any): EventDataItem {
    return {
      eventId: item.eventID,
      eventType: item.eventType.eventTypeName,
      eventName: item.eventNameShort,
      regionPeril: item.regionPeril?.regionPerilName || '<No Data>',
      createdBy: item.createUser.userName,
      createdDate: new Date(item.createDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      restricted: item.isRestrictedAccess ? 'Yes' : 'No',
      archived: item.isArchived ? 'Yes' : 'No'
    };
  }

  private mapColumnNameToField(columnName: string): string {
    const fieldMap: { [key: string]: string } = {
      'Event ID': 'eventId',
      'Event Type': 'eventType',
      'Event Name': 'eventName',
      'Region-Peril': 'regionPeril',
      'Created By': 'createdBy',
      'Created Date': 'createdDate',
      'Restricted': 'restricted',
      'Archived': 'archived',
    };
    return fieldMap[columnName] || columnName;
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
