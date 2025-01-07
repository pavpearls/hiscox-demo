import { Injectable } from '@angular/core';
import { AddEventConfig, EventDetailsForm } from '../interfaces/events.interfaces';
import { Event, EventType, RegionPeril } from '@shared/api-services/models';

@Injectable({
  providedIn: 'root'
})
export class EventsCatalogService {
  constructor() {}

  prepareAddEventConfig(
    config: AddEventConfig,
    regionPerilList: RegionPeril[],
    hiscoxImpactList: string[],
    industryLossList: number[],
    eventsTypeList: EventType[],
    selectedTab: string
  ): AddEventConfig {
    config.regionPerilOptions = regionPerilList.map(item => ({
      displayValue: item?.regionPerilName?.toString() ?? '',
      actualValue: item?.regionPerilID?.toString() ?? ''
    }));
    config.hiscoxImpactOptions = hiscoxImpactList.map(item => ({
      displayValue: item?.toString() ?? '',
      actualValue: item?.toString() ?? ''
    }));
    config.industryLossOptions = industryLossList.map(item => ({
      displayValue: item?.toString() ?? '',
      actualValue: item?.toString() ?? ''
    }));

    const tabConfig: any = [
      { name: 'rds', allowMultiple: false },
      { name: 'event', allowMultiple: false },
      { name: 'response scenario', allowMultiple: true }
    ]

    const eventType = eventsTypeList.find(
      x => x?.eventTypeName?.toLowerCase() === selectedTab.toLowerCase() || x?.eventTypeID?.toString() === selectedTab.toString()
    );

    if (eventType) {
      config.eventTypeId = eventType?.eventTypeID?.toString() ?? '';
      config.allowMultipleEvents = tabConfig.find((x: any) => x.name === selectedTab)?.allowMultiple || false;
    }

    return config;
  }

  generateEvents(eventForm: any, config: AddEventConfig): Event[] {
    const { eventDate, eventName, eventTypeId, events, regionPeril } = eventForm;

    const baseEvent: Event = {
      eventTypeID: Number(eventTypeId),
      regionPerilID: Number(config.regionPerilOptions.find(x =>x.displayValue === regionPeril)?.actualValue) ?? null,
      eventNameShort: eventName,
      eventNameLong: '',
      eventDate,
      industryLossEstimate: null,
      hiscoxLossImpactRating: null,
      isRestrictedAccess: false,
      isArchived: false,
      createdBy: null,
      createDate: eventDate ?? null,
    };

    if (events?.length > 0) {
      return events.map((evt: any) => ({
        ...baseEvent,
        industryLossEstimate: evt.industryLoss,
        hiscoxLossImpactRating: evt.hiscoxImpact
      }));
    } else {
      return [baseEvent];
    }
  }
}
