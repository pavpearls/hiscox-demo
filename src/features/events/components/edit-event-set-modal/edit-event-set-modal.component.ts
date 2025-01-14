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
  @Input() existingEventSet!: EventSet | null;
  @Input() existingEvents: Event[] = [];

  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  eventSetForm: FormGroup;
  modalWidth: string | number = '80%';
  eventsTypeList: EventType[] = [];
  selectedNewEvents: Event[] = [];
  selectedDeleteEvents: Event[] = [];
  currentEventSetEvents: Event[] = [];

  eventsTypeList$: Observable<RemoteData<EventType[], HttpErrorResponse>> =
    this.eventsFacade.state.events.eventsTypeList$;

  eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> =
    this.eventsFacade.state.events.eventsByEventType$.pipe(filterSuccess());
  
  addEventConfig = CATALOG_ADD_EVENT_CONFIG;
  selectedTab$: Observable<string> = this.eventsFacade.state.events.activeTab$;
  selectedEventSetTypeName = '';

  constructor(
    private fb: FormBuilder,
    private eventsFacade: EventsFacade,
    private eventsCatalogService: EventsCatalogService
  ) {
    this.eventsFacade.actions.events.loadEventTypeList();

    this.eventSetForm = this.fb.group({
      eventSetName: ['', [Validators.required, Validators.maxLength(200)]],
      eventSetDescription: [''],
      eventType: [null, [Validators.maxLength(200)]],
      events: [[], [Validators.required, this.validateSelectedRows()]],
    });
  }

  ngOnInit(): void {
    combineLatest([this.eventsTypeList$.pipe(filterSuccess()), this.selectedTab$])
      .subscribe(([eventsTypeList, selectedTab]) => {
        this.eventsTypeList = eventsTypeList.value;
        let res = this.eventsTypeList.find(e => e?.eventTypeID?.toString() == selectedTab)?.eventTypeName;
        if (res) {
          this.selectedEventSetTypeName = res;
        }

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
      events: events,
    });

    if (eventSet.eventSetTypeID) {
      this.eventsFacade.actions.events.loadEventsByEventType({ eventTypeId: eventSet.eventSetTypeID.toString() });     
    }

  }

  handleOk(): void {
    if (this.eventSetForm.valid) {
      const formValue = this.eventSetForm.value;

      const payload = {
        eventSet: {
          eventSetID: this.existingEventSet?.eventSetID,
          eventSetTypeID: formValue.eventType,
          eventSetName: formValue.eventSetName,
          eventSetDescription: formValue.eventSetDescription,
          isArchived: this.existingEventSet?.isArchived,
          createdBy: this.existingEventSet?.createdBy,
          createDate: this.existingEventSet?.createDate,
        },
        addedEventSetMemberItems: this.getAddedItemsPayload(),
        deletedEventIds: this.getDeletedItemsPayload()
      };

      this.onOk.emit(payload);
      this.showModal = false;
    } else {
      this.eventSetForm.markAllAsTouched();
    }
  }

  getAddedItemsPayload(): any[] {
    let eventSetMemberItems = [];
    for (let index = 0; index < this.selectedNewEvents.length; index++) {
      eventSetMemberItems.push(
        {
          eventSetID: this.existingEventSet?.eventSetID,
          eventId: this.selectedNewEvents[index].eventID,
          eventOrder: 1,
          simYear: index + 1,
          createdBy: this.existingEventSet?.createdBy,
        }
      )
    }

    return eventSetMemberItems
  }

  getDeletedItemsPayload(): any[] {
    let eventIdList = [];
    for (let index = 0; index < this.selectedDeleteEvents.length; index++) {
      eventIdList.push(this.selectedDeleteEvents[index].eventID)
    }
    return eventIdList
  }

  handleCancel(): void {
    this.onCancel.emit();
    this.showModal = false;
    this.eventSetForm.reset();
  }

  updateAvailableEventsSelection(selectedRows: Event[]): void {
    this.selectedNewEvents = selectedRows;
    this.eventSetForm.get('events')?.setValue([...this.currentEventSetEvents, ...this.selectedNewEvents]);
  }

  deleteEventsSelection(selectedRows: Event[]): void {
    this.selectedDeleteEvents = selectedRows;

  }

  private validateSelectedRows() {
    return (control: any) => {
      const value = control.value;
      return value && value.length > 0 ? null : { required: true };
    };
  }
}
