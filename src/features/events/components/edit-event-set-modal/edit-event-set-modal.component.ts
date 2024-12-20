import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
  } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { EventsFacade } from '@events//store/events.facade';
  import { EventSet, Event, EventType } from '@shared/api-services/models';
  import { filterSuccess, RemoteData } from 'ngx-remotedata';
  import { combineLatest, Observable } from 'rxjs';
  import { HttpErrorResponse } from '@angular/common/http';
  import { CATALOG_ADD_EVENT_CONFIG } from '@events//config/events-catalog-dashboard-page.config';
  import { EventsCatalogService } from '@events//services/events-catalog.service';
  
  @Component({
    selector: 'edit-event-set-modal',
    templateUrl: './edit-event-set-modal.component.html',
    styleUrls: ['./edit-event-set-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class EditEventSetModalComponent implements OnInit, OnChanges {
    @Input() showModal = false;
    @Input() existingEventSet!: EventSet;   // The existing event set data
    @Input() existingEvents: Event[] = [];  // Events currently associated with the event set
  
    @Output() onOk = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<void>();
  
    eventSetForm: FormGroup;
    modalWidth: string | number = '80%';
    eventsTypeList: EventType[] = [];
    // Events selected from the "Available Events" tab to be added
    selectedNewEvents: Event[] = [];
    // Events currently in the event set, can be edited or removed
    currentEventSetEvents: Event[] = [];
  
    eventsTypeList$: Observable<RemoteData<EventType[], HttpErrorResponse>> =
      this.eventsFacade.state.events.eventsTypeList$;
  
    eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> =
      this.eventsFacade.state.events.eventsByEventType$.pipe(filterSuccess());
  
    addEventConfig = CATALOG_ADD_EVENT_CONFIG;
    selectedTab$: Observable<string> = this.eventsFacade.state.events.activeTab$;
  
    constructor(
      private fb: FormBuilder,
      private eventsFacade: EventsFacade,
      private eventsCatalogService: EventsCatalogService
    ) {
      this.eventsFacade.actions.events.loadEventTypeList();
  
      this.eventSetForm = this.fb.group({
        eventSetName: ['', [Validators.required, Validators.maxLength(200)]],
        eventSetDescription: [''],
        eventType: [null, [Validators.required, Validators.maxLength(200)]],
        // Not directly bound to final data, but used as a form validator placeholder
        events: [[], [Validators.required, this.validateSelectedRows()]],
      });
    }
  
    ngOnInit(): void {
      // Combine latest event type list and active tab for dynamic configuration
      combineLatest([this.eventsTypeList$.pipe(filterSuccess()), this.selectedTab$])
        .subscribe(([eventsTypeList, selectedTab]) => {
          this.eventsTypeList = eventsTypeList.value;
  
          this.addEventConfig = {
            ...this.eventsCatalogService.prepareAddEventConfig(
              this.addEventConfig,
              [],
              [],
              [],
              eventsTypeList.value,
              selectedTab
            ),
          };
  
          const selectedEventTypeId = this.eventSetForm.get('eventType')?.value;
          if (selectedEventTypeId) {
            this.eventsFacade.actions.events.loadEventsByEventType({ eventTypeId: selectedEventTypeId });
          }
        });
  
      // When eventType changes, load events
      this.eventSetForm.get('eventType')?.valueChanges.subscribe((eventTypeId) => {
        if (eventTypeId) {
          this.eventsFacade.actions.events.loadEventsByEventType({ eventTypeId });
        }
      });
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['existingEventSet'] && this.existingEventSet) {
        this.patchFormValues(this.existingEventSet, this.existingEvents);
      }
    }
  
    patchFormValues(eventSet: EventSet, events: Event[]): void {
      this.eventSetForm.patchValue({
        eventSetName: eventSet.eventSetName,
        eventSetDescription: eventSet.eventSetDescription,
        eventType: eventSet.eventSetTypeID,
        events: events, // For validation, but we keep the actual arrays separately
      });
      this.currentEventSetEvents = [...events];
  
      if (eventSet.eventSetTypeID) {
        this.eventsFacade.actions.events.loadEventsByEventType({ eventTypeId: eventSet.eventSetTypeID.toString() });
      }
    }
  
    handleOk(): void {
      if (this.eventSetForm.valid) {
        // Prepare the final updated list of events:
        // Start with the current events, minus any removed by the user,
        // plus any new events selected from the first tab.
        const finalEvents = [...this.currentEventSetEvents, ...this.selectedNewEvents];
  
        const formValue = this.eventSetForm.value;
        const payload = {
          eventSetID: this.existingEventSet.eventSetID,
          eventSetTypeID: formValue.eventType,
          eventSetName: formValue.eventSetName,
          eventSetDescription: formValue.eventSetDescription,
          isArchived: this.existingEventSet.isArchived,
          createdBy: this.existingEventSet.createdBy,
          createDate: this.existingEventSet.createDate,
          eventRequests: finalEvents // updated list
        };
  
        this.onOk.emit(payload);
        this.showModal = false;
      } else {
        this.eventSetForm.markAllAsTouched();
      }
    }
  
    handleCancel(): void {
      this.onCancel.emit();
      this.showModal = false;
      this.eventSetForm.reset();
    }
  
    handleAvailableEventsSelection(selectedRows: Event[]): void {
      this.selectedNewEvents = selectedRows;
      // Update form events for validation
      this.eventSetForm.get('events')?.setValue([...this.currentEventSetEvents, ...this.selectedNewEvents]);
    }
  
    handleCurrentEventsChange(updatedEvents: Event[]): void {
      this.currentEventSetEvents = updatedEvents;
      // Update form events for validation
      this.eventSetForm.get('events')?.setValue([...this.currentEventSetEvents, ...this.selectedNewEvents]);
    }
  
    private validateSelectedRows() {
      return (control: any) => {
        const value = control.value;
        return value && value.length > 0 ? null : { required: true };
      };
    }
  }
  