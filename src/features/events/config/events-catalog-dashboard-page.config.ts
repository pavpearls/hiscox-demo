import { AddEventConfig } from "../interfaces/events.interfaces";

export const CATALOG_ADD_EVENT_CONFIG: AddEventConfig = {
  eventTypeId: '',
  regionPerilOptions: [],
  hiscoxImpactOptions: [],
  industryLossOptions: [],
  allowMultipleEvents: true,
  allowMultipleRowSelection: false,
  labels: {},
  errorMessages: {},
  presetValues: { eventDate: new Date() },
};

export const CATALOG_EVENTS_TABS = [
  { key: 'rds', label: 'RDS', id: 1 },
  { key: 'event', label: 'Post Event', id:2 },
  { key: 'event response', label: 'Event Response', id: 3 },
];

export const EVENT_SET_TABS = [
  { key: 'rds', label: 'RDS', id: 1 },
  { key: 'event', label: 'Post Event', id:2 },
  { key: 'response_scenario', label: 'Response Scenario', id: 3 },
];

export const CATALOG_ADD_EVENT_PANEL = [
  { active: true, name: 'New Event', disabled: false },

];

export const CATALOG_TABLE_PANEL = [{ active: true, name: 'Catalog', disabled: false }];

