import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { DropdownOption } from 'shared/interfaces/dropdown-options.interface';

export interface EventDataItem {
  eventId: number;
  eventType: string;
  eventName: string;
  regionPeril: string;
  createdBy: string;
  createdDate: string;
  restricted: string;
  archived: string;
}

export interface EventColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<EventDataItem> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<EventDataItem> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

export interface AddEventConfig {
  eventTypeId: string;
  regionPerilOptions: DropdownOption[];
  hiscoxImpactOptions: DropdownOption[];
  industryLossOptions: DropdownOption[];
  allowMultipleEvents: boolean;
  labels?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: string;
    industryLoss?: string;
    hiscoxImpact?: string;
  };
  errorMessages?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: string;
    industryLoss?: string;
    hiscoxImpact?: string;
  };
  presetValues?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: Date;
    events?: { industryLoss?: string; hiscoxImpact?: string }[];
  };
}

export interface EventGroup {
  industryLoss: FormControl<string>;
  hiscoxImpact: FormControl<string | null>;
}

export interface AddEventForm {
  eventTypeId: FormControl<string>;
  eventName: FormControl<string>;
  regionPeril: FormControl<string | null>;
  eventDate: FormControl<Date | null>;
  events: FormArray<FormGroup<EventDetailsForm>>;
}

export interface EventDetailsForm {
  industryLoss: FormControl<string>;
  hiscoxImpact: FormControl<string | null>;
}