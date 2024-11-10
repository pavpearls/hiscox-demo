import { Component, OnInit } from '@angular/core';
import { filterSuccess } from 'ngx-remotedata';
import { combineLatest, take } from 'rxjs';
import { ADD_EVENT_CONFIG } from '../../config/events-catalog-dashboard-page.config';
import {
  EventColumnItem,
  EventDataItem,
} from '../../interfaces/events.interfaces';
import {
  MOCK_EVENT_DATA,
  MOCK_EVENT_TABLE_COLUMNS,
} from '../../mocks/mock-events-table-data';
import { EventsFacade } from '../../store/events.facade';
import{ Event } from '../../../../shared/api-services/nds-api/generated/model/event';
@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-set-dashboard.component.html',
  styleUrls: ['./events-set-dashboard.component.scss'],
})
export class EventsSetDashboardComponent implements OnInit {
  eventsTypeList$ = this.eventsFacade.eventsTypeList$;
  regionPerilList$ = this.eventsFacade.regionPerilList$;
  industryLossList$ = this.eventsFacade.industryLossList$;
  hiscoxImpactList$ = this.eventsFacade.hiscoxImpactList$;

  selectedTab = '';

  addEventConfig = ADD_EVENT_CONFIG;

  isActive = true;
  expandIconPosition: 'start' | 'end' = 'end';

  rdsPanel = [
    {
      active: true,
      name: 'RDS',
      disabled: false,
    },
  ];

  rdsPanelTable = [
    {
      active: true,
      name: 'RDS SET',
      disabled: false,
    },
  ];

  columns: EventColumnItem[] = MOCK_EVENT_TABLE_COLUMNS;
  data: EventDataItem[] = MOCK_EVENT_DATA;

  constructor(private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.loadDashboardFilters();
  }

  loadDashboardFilters(): void {
    this.eventsFacade.loadRegionPerilList();
    this.eventsFacade.loadEventTypeList();
    this.eventsFacade.loadHiscoxImpactList();
    this.eventsFacade.loadIndustryLossList();
  }

  setDashboardFilterOptions(tab: string): void {
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
          this.mapDataToAddEventConfig(
            regionPerilList.value,
            hiscoxImpactList.value,
            industryLossList.value,
            eventsTypeList.value
          );
        }
      );
  }

  mapDataToAddEventConfig(
    regionPerilList: any[],
    hiscoxImpactList: any[],
    industryLossList: any[],
    eventsTypeList: any[]
  ): void {
    this.addEventConfig.regionPerilOptions = regionPerilList.map(item => ({
      displayValue: item.regionPerilName,
      actualValue: item.regionPerilId
    }));

    this.addEventConfig.hiscoxImpactOptions = hiscoxImpactList.map(item => ({
      displayValue: item,
      actualValue: item
    }));

    this.addEventConfig.industryLossOptions = industryLossList.map(item => ({
      displayValue: item,
      actualValue: item
    }));

    if (this.selectedTab === 'rds') {
      const eventType = eventsTypeList.find(x =>x.name.toLowerCase() === 'rds')
      if (eventType) {
        this.addEventConfig.eventTypeId = eventType.eventTypeId;
        this.addEventConfig.allowMultipleEvents = false;
      }
    } 

    if (this.selectedTab === 'postEvent') {
      const eventType = eventsTypeList.find(x =>x.name.toLowerCase() === 'event')
      if (eventType) {
        this.addEventConfig.eventTypeId = eventType.eventTypeId;
        this.addEventConfig.allowMultipleEvents = false;
      }
    } 

    if (this.selectedTab === 'eventResponse') {
      const eventType = eventsTypeList.find(x =>x.name.toLowerCase() === 'event')
      if (eventType) {
        this.addEventConfig.eventTypeId = eventType.eventTypeId;
        this.addEventConfig.allowMultipleEvents = true;
      }
    } 
  
    const payload = {eventTypeId: this.addEventConfig.eventTypeId};
    if(payload?.eventTypeId) {
      this.eventsFacade.loadEventsByEventType(payload);
    }
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
    this.setDashboardFilterOptions(tab);
  }

  handleEventAdded($event: any): void {
    const  {eventDate, eventName, eventTypeId, events, regionPeril} = $event;
    
    const newEvent: Event = {
      eventTypeID: eventTypeId,
      regionPerilID: regionPeril,
      eventNameShort: eventName,
      eventNameLong: '',
      eventDate,
      industryLossEstimate: null,
      hiscoxLossImpactRating: null,
      isRestrictedAccess: false,
      isArchived: false,
      createUserID: null,
      createDate: new Date(),
      createUser: undefined
    };

    if ($event.events.length > 0) {
      events.forEach((event: any) => {
        const multipleEvent = {...newEvent, industryLossEstimate: event.industryLoss, hiscoxLossImpact: event.hiscoxImpact }
        this.eventsFacade.addNewEvent(multipleEvent);
      });
    } else {
      this.eventsFacade.addNewEvent(newEvent);
    }
  }
}
