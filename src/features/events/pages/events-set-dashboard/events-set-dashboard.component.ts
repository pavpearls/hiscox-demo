import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CATALOG_ADD_EVENT_CONFIG, CATALOG_EVENTS_TABS } from '@events//config/events-catalog-dashboard-page.config';
import { EventsCatalogService } from '@events//services/events-catalog.service';
import { EventsFacade } from '@events//store/events.facade';
import { EventType, RegionPeril } from '@shared/api-services/models';
import { filterSuccess, RemoteData } from 'ngx-remotedata';
import { combineLatest, Observable, take } from 'rxjs';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-set-dashboard.component.html',
  styleUrls: ['./events-set-dashboard.component.scss'],
})
export class EventsSetDashboardComponent implements OnInit {
  eventSetList$: Observable<RemoteData<any[], HttpErrorResponse>> = this.eventsFacade.state.eventSets. getEventSetList$;
  
  eventSetData : any[] = [];
  eventSetRawData : any[] = [];
  tabs = CATALOG_EVENTS_TABS;
  isComponentAlive = true;
  selectedTabId = 1 // RDS;
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;

  constructor(private eventsFacade: EventsFacade) {  }

  ngOnInit(): void {
    this.populateEventSetData();
    
    this.eventSetList$.subscribe((data: any) => {
      this.eventSetRawData = data.value;
      this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
    })
   
  }

  filterBySelectedTab(dataList: any[]) : any[] {
    return dataList ? dataList.filter(d=> d.eventTypeID === this.selectedTabId) : [];
  }

  populateEventSetData() {
    this.eventsFacade.actions.eventSets.getEventSetList();

    this.eventsFacade.showLoadingSpinnerForApiResponses(
      this.eventsFacade.state.eventSets.getEventSetList$,
    );
  }

  setActiveTab(tabId: number): void {
    this.selectedTabId = tabId;  
    this.eventSetData = this.filterBySelectedTab(this.eventSetRawData);
  }

  
}
