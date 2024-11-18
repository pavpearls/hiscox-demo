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
  eventsTypeList$: Observable<RemoteData<EventType[], HttpErrorResponse>> = this.eventsFacade.state.events.eventsTypeList$;
  regionPerilList$: Observable<RemoteData<RegionPeril[], HttpErrorResponse>> = this.eventsFacade.state.events.regionPerilList$;
  industryLossList$: Observable<RemoteData<number[], HttpErrorResponse>> = this.eventsFacade.state.events.industryLossList$;
  hiscoxImpactList$: Observable<RemoteData<string[], HttpErrorResponse>> = this.eventsFacade.state.events.hiscoxImpactList$;

  listOfParentData: any[] = [];
  listOfChildrenData: any[] = [];
  tabs = CATALOG_EVENTS_TABS;
  showTable = false;
  isComponentAlive = true;
  selectedTab = '';
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;

  isModalVisible = false;

  eventForm: FormGroup;
  eventTypeOptions = [
    { label: 'Event Response', value: 'EventResponse' },
    { label: 'Another Type', value: 'AnotherType' },
  ];

  industryLossOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
  ];

  hiscoxImpactOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Very High', value: 'VeryHigh' },
  ];

  existingEventSetOptions = [
    { label: 'Beryl', value: 'Beryl' },
    { label: 'Milton', value: 'Milton' },
  ];

  regionPerilOptions = [
    { label: 'Beryl', value: 'Beryl' },
    { label: 'Milton', value: 'Milton' },
  ]

  constructor(private eventsFacade: EventsFacade, private cdr: ChangeDetectorRef, private eventsCatalogService: EventsCatalogService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      eventSetName: [''],
      eventType: [''],
      eventDate: [''],
      eventName: [''],
      industryLoss: [[]],
      regionPeril: [''],
      hiscoxLossImpact: [[]],
      isAggregateEvent: [false],
      existingEventSet: [''],
    });
  }

  ngOnInit(): void {
    this.loadCatalogDashboardPageData();

    this.eventsFacade.actions.eventSets.getEventSetList();
    this.eventsFacade.actions.eventSetMemberships.getMembershipList();

    // this.eventsFacade.state.eventSets.getEventSetList$
    //   .pipe(filterSuccess())
    //   .subscribe(data => {

    //     data.value.forEach((row: any, index: number) => {
    //       // Map Parent Data
    //       this.listOfParentData.push({
    //         key: index, // Unique key for each parent
    //         name: row.eventSetName || '<No Name>',
    //         description: row.eventSetDescription || '<No Description>',
    //         createDate: row.createDate || '<No Date>',
    //         createUser: row.createUser?.userName || '<Unknown User>',
    //         expand: false, // Default collapsed
    //       });

    //             // Map Children Data
    //             if (row.events) {
    //               row.events.forEach((event: any, childIndex: number) => {
    //                 this.listOfChildrenData.push({
    //                   key: `${index}-${childIndex}`, // Unique key for child
    //                   parentKey: index, // Reference to parent key
    //                   eventID: event?.eventID?.toString() || '<No Data>',
    //                   eventTypeName: event.eventType?.eventTypeName || '<No Type>',
    //                   eventNameShort: event.eventNameShort || '<No Name>',
    //                   regionPerilName: event.regionPeril?.regionPerilName || '<No Region>',
    //                   userName: event.createUser?.userName || '<No User>',
    //                   createDate: event.createDate ? new Date(event.createDate).toLocaleDateString('en-GB') : '<No Date>',
    //                   industryLossEstimate: event.industryLossEstimate || '<No Data>',
    //                   hiscoxLossImpactRating: event.hiscoxLossImpactRating || '<No Rating>',
    //                   isRestrictedAccess: event.isRestrictedAccess || false,
    //                   isArchived: event.isArchived || false,
    //                 });
    //               });
    //             }
    //           });

    //           this.showTable = true;
    //         });
  }

  loadCatalogDashboardPageData(): void {
    this.eventsFacade.actions.events.loadRegionPerilList();
    this.eventsFacade.actions.events.loadEventTypeList();
    this.eventsFacade.actions.events.loadHiscoxImpactList();
    this.eventsFacade.actions.events.loadIndustryLossList();

    this.eventsFacade.showLoadingSpinnerForApiResponses(
      this.eventsFacade.state.events.eventsTypeList$,
      this.eventsFacade.state.events.regionPerilList$,
      this.eventsFacade.state.events.industryLossList$,
      this.eventsFacade.state.events.hiscoxImpactList$,
      this.eventsFacade.state.events.addEvent$,
      this.eventsFacade.state.events.deleteEvent$,
      this.eventsFacade.state.events.eventsByEventType$
    );
  }

  getChildrenForParent(parentKey: number): any[] {
    return this.listOfChildrenData.filter(child => child.parentKey === parentKey);
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
    this.setDashboardFilterOptions();
  }

  setDashboardFilterOptions(): void {
    combineLatest([
      this.regionPerilList$.pipe(filterSuccess()),
      this.hiscoxImpactList$.pipe(filterSuccess()),
      this.industryLossList$.pipe(filterSuccess()),
      this.eventsTypeList$.pipe(filterSuccess()),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          regionPerilList,
          hiscoxImpactList,
          industryLossList,
          eventsTypeList,
        ]) => {
          this.addEventConfig = this.eventsCatalogService.prepareAddEventConfig(
            this.addEventConfig,
            regionPerilList.value,
            hiscoxImpactList.value,
            industryLossList.value,
            eventsTypeList.value,
            this.selectedTab
          );

          if (this.addEventConfig.eventTypeId) {
            this.showTable = false;

            this.eventsFacade.state.eventSets.getEventSetList$
              .pipe(filterSuccess())
              .subscribe(data => {

                const filteredData = data.value.filter(x => x.eventTypeID?.toString() === this.addEventConfig.eventTypeId);

                this.listOfParentData = [];
                this.listOfChildrenData = [];

                filteredData.forEach((row: any, index: number) => {
                  this.listOfParentData.push({
                    key: index,
                    name: row.eventSetName || '<No Name>',
                    description: row.eventSetDescription || '<No Description>',
                    createDate: row.createDate ? new Date(row.createDate).toISOString() : 'No Date',
                    createUser: row.createUser?.userName || '<Unknown User>',
                    expand: false,
                  });

                  if (row.events) {
                    row.events.forEach((event: any, childIndex: number) => {
                      this.listOfChildrenData.push({
                        key: `${index}-${childIndex}`,
                        parentKey: index,
                        eventID: event?.eventID?.toString() || '<No Data>',
                        eventTypeName: event.eventType?.eventTypeName || '<No Type>',
                        eventNameShort: event.eventNameShort || '<No Name>',
                        regionPerilName: event.regionPeril?.regionPerilName || '<No Region>',
                        userName: event.createUser?.userName || '<No User>',
                        createDate: event.createDate ? new Date(event.createDate).toLocaleDateString('en-GB') : '<No Date>',
                        industryLossEstimate: event.industryLossEstimate || '<No Data>',
                        hiscoxLossImpactRating: event.hiscoxLossImpactRating || '<No Rating>',
                        isRestrictedAccess: event.isRestrictedAccess || false,
                        isArchived: event.isArchived || false,
                      });
                    });
                  }
                });

                this.showTable = true;
              });
          }
        }
      );
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.eventForm.reset();
  }

  handleSave(): void {
    if (this.eventForm.valid) {
      console.log('Form Submitted:', this.eventForm.value);
      this.isModalVisible = false;
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  onAddEventSet(): void {
    this.openModal();
  }
}
