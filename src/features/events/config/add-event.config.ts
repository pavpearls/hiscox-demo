import { AddEventConfig } from "../interfaces/events.interfaces";

export const ADD_EVENT_CONFIG: AddEventConfig = {
  eventTypeId: '',
  regionPerilOptions: [],
  hiscoxImpactOptions: [],
  industryLossOptions: [],
  allowMultipleEvents: false,
  labels: {},
  errorMessages: {},
  presetValues: { eventDate: new Date() },
};
