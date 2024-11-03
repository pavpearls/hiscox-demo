import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

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