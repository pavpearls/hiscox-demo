import { AddEventConfig } from "../interfaces/events.interfaces";

export const CATALOG_ADD_EVENT_CONFIG: AddEventConfig = {
  eventTypeId: '',
  regionPerilOptions: [],
  hiscoxImpactOptions: [],
  industryLossOptions: [],
  allowMultipleEvents: false,
  labels: {},
  errorMessages: {},
  presetValues: { eventDate: new Date() },
};

export const CATALOG_EVENTS_TABS = [
  { key: 'rds', label: 'RDS' },
  { key: 'postEvent', label: 'Post Event' },
  { key: 'eventResponse', label: 'Event Response' },
];

export const CATALOG_ADD_EVENT_PANEL = [
  { active: true, name: 'New Event', disabled: false },

];

export const CATALOG_TABLE_PANEL = [{ active: true, name: 'Catalog', disabled: false }];

