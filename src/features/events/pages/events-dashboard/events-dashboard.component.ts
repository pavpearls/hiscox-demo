import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { EventsFacade } from '../../store/events.facade';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  selectedTab = 'rds';

  eventsTypeList$ = this.eventsFacade.eventsTypeList$;
  regionPerilList$ = this.eventsFacade.regionPerilList$;

  constructor(private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.eventsFacade.loadRegionPerilList();
    this.eventsFacade.loadEventTypeList();
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
  }
}
