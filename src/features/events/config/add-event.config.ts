import { AddEventConfig } from '../components/add-event-form/add-event-form.component';

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
