import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NdsApiServiceWrapper } from '../shared/api-services/nds-api/custom/nds-api-service-wrapper';
import {Event} from '../shared/api-services/nds-api/generated/model/event';
import { EventSetMemberRequest, EventSetRequest } from '../shared/api-services/nds-api/generated';
@Component({
  selector: 'app-test-api',
  templateUrl: './app-api-testing.component.html',
})
export class TestApiComponent implements OnInit {
  constructor(
    private ndsApiServiceWrapper: NdsApiServiceWrapper,
  ) {}

  ngOnInit(): void {
    this.fetchDependentData().subscribe(
      (data) => {
        console.log('Dependent data fetched successfully:', data);
        // Comment out to test CRUD
        // this.createEvent(data);
        // this.createEventSet(data);
        // this.createEventSetMember(data);
      },
      (error) => {
        console.error('Error fetching dependent data:', error);
      }
    );
  }

  private fetchDependentData() {
    return forkJoin({
      appLogs: this.ndsApiServiceWrapper.appLogService.getAppLogList(),
      events: this.ndsApiServiceWrapper.eventService.getEventList(),
      eventsListByType:  this.ndsApiServiceWrapper.eventService.getEventByEventTypeId(2),
      eventSets: this.ndsApiServiceWrapper.eventSetService.getEventSetList(),
      eventSetMembers: this.ndsApiServiceWrapper.eventSetMemberService.getEventSetMemberList(),
      getEventTypeList: this.ndsApiServiceWrapper.parameterService.getEventTypeList(),
      getHiscoxImpactAsync: this.ndsApiServiceWrapper.parameterService.getHiscoxImpactAsync(),
      getIndustryLossEstimateList: this.ndsApiServiceWrapper.parameterService.getIndustryLossEstimateList(),
      getRegionPerilList: this.ndsApiServiceWrapper.parameterService.getRegionPerilList(),
      getRegionPerilTypeList: this.ndsApiServiceWrapper.parameterService.getRegionPerilTypeList()
    });
  }

  private createEvent(data: any) {
    const payload: Event = {
        eventTypeID: 2,
        regionPerilID: 9,
        createUserID: null,
        eventNameShort: 'Pav Event',
        eventNameLong: 'Pav Event Long Description',
        eventDate: new Date(),
        industryLossEstimate: 10,
        hiscoxLossImpactRating: 'HIGH',
        isLossPick: false,
        isRestrictedAccess: false,
        isArchived: false,
        createUser: undefined,
        eventSetMembers: []
    };
    this.ndsApiServiceWrapper.eventService.createEvent(payload).subscribe(
      (response) => console.log('Event Created:', response),
      (error) => console.error('Event Creation Error:', error)
    );
  }

  private createEventSet(data: any) {
    const payload: EventSetRequest = {
     eventTypeID: 2,
     eventSetName: 'Pav Set Name',
     eventSetDescription: 'Pav Test Set',
     isArchived: false,
     createUserID: null,
     createDate: new Date()
    };
    this.ndsApiServiceWrapper.eventSetService.createEventSet(payload).subscribe(
      (response) => console.log('EventSet Created:', response),
      (error) => console.error('EventSet Creation Error:', error)
    );
  }

//   private addEventToEventSet(data: any) {
//     const payload: EventSetRequest = {
//      eventTypeID: 2,
//      eventSetName: 'Pav Set Name',
//      eventSetDescription: 'Pav Test Set',
//      isArchived: false,
//      createUserID: null,
//      createDate: new Date()
//     };
//     this.ndsApiServiceWrapper.eventService..(payload).subscribe(
//       (response) => console.log('EventSet Created:', response),
//       (error) => console.error('EventSet Creation Error:', error)
//     );
//   }

  private createEventSetMember(data: any) {
    const payload: EventSetMemberRequest = {
        eventID: 1,
        eventSetID: 1,
        eventOrder: undefined
    };
    this.ndsApiServiceWrapper.eventSetMemberService.createEventSetMember(payload).subscribe(
      (response) => console.log('EventSetMember Created:', response),
      (error) => console.error('EventSetMember Creation Error:', error)
    );
  }
}