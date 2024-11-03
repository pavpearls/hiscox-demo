import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { EventsFacade } from '../../store/events.facade';
import { EventColumnItem, EventDataItem } from '../../interfaces/events.interfaces';
import { MOCK_EVENT_DATA, MOCK_EVENT_TABLE_COLUMNS } from '../../mocks/mock-events-table-data';
import { inProgress } from 'ngx-remotedata';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  selectedTab = '';

  eventsTypeList$ = of(inProgress());
  regionPerilList$ = of(inProgress());

  addEventConfig = {
    regionOptions: ['Region 1', 'Region 2'],
    impactOptions: ['Low', 'Medium', 'High'],
    allowMultipleEvents: true,
    labels: { eventName: 'Event Name' },
    errorMessages: { eventName: 'Please enter the event name' },
    presetValues: { eventName: 'Sample Event', eventDate: new Date() }
  }

  columns: EventColumnItem[] = MOCK_EVENT_TABLE_COLUMNS;
  data: EventDataItem[] = MOCK_EVENT_DATA;

  constructor(private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.eventsFacade.loadRegionPerilList();
    this.eventsFacade.loadEventTypeList();
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
  }

  handleEventAdded($event: any): void {
    console.log('handleEventAdded', $event);
  }
}
