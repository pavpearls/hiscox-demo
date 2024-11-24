import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsFacade } from '@events//store/events.facade';
import { RemoteData, filterSuccess } from 'ngx-remotedata';
import { combineLatest, Observable } from 'rxjs';
import { EventType, RegionPeril, Event } from '@shared/api-services/models';
import { CATALOG_ADD_EVENT_CONFIG } from '@events//config/events-catalog-dashboard-page.config';
import { EventsCatalogService } from '@events//services/events-catalog.service';

@Component({
  selector: 'add-event-set-modal',
  templateUrl: './add-event-set-modal.component.html',
  styleUrls: ['./add-event-set-modal.component.scss'],
})
export class AddEventSetModalComponent {
  @Input() showModal = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  eventSetForm: FormGroup;
  modalWidth: string | number = '80%';

  selectedRows: any[] = [];
  eventsTypeList$: Observable<RemoteData<EventType[], HttpErrorResponse>> = this.eventsFacade.state.events.eventsTypeList$;
  eventList$: Observable<RemoteData<Event[], HttpErrorResponse>> = this.eventsFacade.state.events.eventsByEventType$.pipe(filterSuccess());
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
      eventSetDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      events: [[], [Validators.required, this.validateSelectedRows()]],
    });

    combineLatest([this.eventsTypeList$.pipe(filterSuccess()), this.selectedTab$]).subscribe(
      ([eventsTypeList, selectedTab]) => {
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

        if (this.addEventConfig.eventTypeId) {
          this.eventsFacade.actions.events.loadEventsByEventType({
            eventTypeId: this.addEventConfig.eventTypeId,
          });
        }
      }
    );
  }

  handleOk(): void {
    if (this.eventSetForm.valid) {
      this.onOk.emit(this.eventSetForm.value);
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

  handleMultipleRows(selectedRows: any[]): void {
    this.selectedRows = selectedRows;
    this.eventSetForm.get('events')?.setValue(selectedRows);
  }

  private validateSelectedRows() {
    return (control: any) => {
      const value = control.value;
      return value && value.length > 0 ? null : { required: true };
    };
  }
}
