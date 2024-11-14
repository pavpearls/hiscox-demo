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

    const tabConfig: any = {
      rds: { name: 'rds', allowMultiple: false },
      postEvent: { name: 'event', allowMultiple: false },
      eventResponse: { name: 'event response', allowMultiple: true }
    };

    const eventType = eventsTypeList.find(
      x => x?.eventTypeName?.toLowerCase() === tabConfig[selectedTab].name
    );

    if (eventType) {
      config.eventTypeId = eventType?.eventTypeID?.toString() ?? '';
      config.allowMultipleEvents = tabConfig[selectedTab].allowMultiple;
    }

    return config;
  }

  generateEvents(eventForm: any): Event[] {
    const { eventDate, eventName, eventTypeId, events, regionPeril } = eventForm;
    const baseEvent: Event = {
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

    if (events.length > 0) {
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
