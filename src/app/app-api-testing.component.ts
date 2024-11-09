import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AppLogService } from './appLog.service';
import { EventService } from './event.service';
import { EventSetService } from './eventSet.service';
import { EventSetMemberService } from './eventSetMember.service';
import { NDSBackendApiService } from './nDSBackendApi.service';
import { ParameterService } from './parameter.service';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss'],
})
export class TestApiComponent implements OnInit {
  constructor(
    private appLogService: AppLogService,
    private eventService: EventService,
    private eventSetService: EventSetService,
    private eventSetMemberService: EventSetMemberService,
    private nDSBackendApiService: NDSBackendApiService,
    private parameterService: ParameterService
  ) {}

  ngOnInit(): void {
    // For testing purpose only 
    // Fetch dependent data first and then perform CRUD operations
    this.fetchDependentData().subscribe(
      (data) => {
        console.log('Dependent data fetched successfully:', data);
        
        // Now we can use this data to perform CRUD operations
        this.createAppLog(data);
        this.createEvent(data);
        this.createEventSet(data);
        this.createEventSetMember(data);
        this.createParameter(data);
      },
      (error) => {
        console.error('Error fetching dependent data:', error);
      }
    );
  }

  // Method to fetch dependent data
  private fetchDependentData() {
    return forkJoin({
      appLogs: this.appLogService.getAppLogList(),
      events: this.eventService.getEventList(),
      eventSets: this.eventSetService.getEventSetList(),
      eventSetMembers: this.eventSetMemberService.getEventSetMemberList(),
      parameters: this.parameterService.getEventTypeList(),
    });
  }

  // Example CRUD Methods using dependent data
  private createAppLog(data: any) {
    const payload = {
      // Use `data.appLogs` as needed to build the payload
      /* your data here */
    };
    this.appLogService.createAppLog(payload).subscribe(
      (response) => console.log('AppLog Created:', response),
      (error) => console.error('AppLog Creation Error:', error)
    );
  }

  private createEvent(data: any) {
    const payload = {
      // Use `data.events` as needed to build the payload
      /* your data here */
    };
    this.eventService.createEvent(payload).subscribe(
      (response) => console.log('Event Created:', response),
      (error) => console.error('Event Creation Error:', error)
    );
  }

  private createEventSet(data: any) {
    const payload = {
      // Use `data.eventSets` as needed to build the payload
      /* your data here */
    };
    this.eventSetService.createEventSet(payload).subscribe(
      (response) => console.log('EventSet Created:', response),
      (error) => console.error('EventSet Creation Error:', error)
    );
  }

  private createEventSetMember(data: any) {
    const payload = {
      // Use `data.eventSetMembers` as needed to build the payload
      /* your data here */
    };
    this.eventSetMemberService.createEventSetMember(payload).subscribe(
      (response) => console.log('EventSetMember Created:', response),
      (error) => console.error('EventSetMember Creation Error:', error)
    );
  }

  private createParameter(data: any) {
    const payload = {
      // Use `data.parameters` as needed to build the payload
      /* your data here */
    };
    this.parameterService.createParameter(payload).subscribe(
      (response) => console.log('Parameter Created:', response),
      (error) => console.error('Parameter Creation Error:', error)
    );
  }

  // You can similarly add methods for `update`, `get`, and `delete`
  // operations using the `data` parameter to reference dependent data as needed.
}
