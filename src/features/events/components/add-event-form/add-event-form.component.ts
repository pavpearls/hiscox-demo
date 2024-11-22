import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddEventConfig, AddEventForm, EventDetailsForm } from '@events//interfaces/events.interfaces';
import { AddEventFormService, EventType } from '@events//services/add-event-form.service';
import { IconsProviderModule } from 'app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DropdownOption } from 'shared/interfaces/dropdown-options.interface';
import { SelectDropdownWithAddOptionComponent } from 'shared/ui-components/ng-zorro-select-dropdown-with-add-option/ng-zorro-select-dropdown-with-add-option.component';

@Component({
  selector: 'app-add-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzFormModule,
    IconsProviderModule,
    SelectDropdownWithAddOptionComponent,
  ],
  templateUrl: './add-event-form.component.html',
  styleUrls: ['./add-event-form.component.scss'],
})
export class AddEventFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) addEventConfig!: AddEventConfig;
  @Output() onEventAdded = new EventEmitter<any>();
  eventForm!: FormGroup<Partial<AddEventForm>>;
  regionPerilOptions: string[] = [];
  hiscoxImpactOptions: string[] = [];
  industryLossOptions: number[] = [];

  constructor(private eventsFormsService: AddEventFormService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addEventConfig']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.eventForm = this.eventsFormsService.initEventForm(this.addEventConfig);

    this.regionPerilOptions = [
      ...this.addEventConfig.regionPerilOptions.map((x: DropdownOption) => x.displayValue),
    ];
    this.industryLossOptions = [
      ...this.addEventConfig.industryLossOptions.map((x: DropdownOption) =>
        Number(x.displayValue)
      ),
    ];
    this.hiscoxImpactOptions = [
      ...this.addEventConfig.hiscoxImpactOptions.map((x: DropdownOption) => x.displayValue),
    ];
  }

  get events(): FormArray<FormGroup<EventDetailsForm>> | undefined {
    return this.eventForm?.controls?.events;
  }

  addEvent(): void {
    this.eventsFormsService.addEvent(this.eventForm);
  }

  removeEvent(index: number): void {
    this.eventsFormsService.removeEvent(this.eventForm, index);
  }

  addToCatalog(): void {
    if (this.eventForm.valid) {
      this.onEventAdded.emit(this.eventForm.getRawValue());
      this.resetForm();
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.eventsFormsService.resetForm(this.eventForm, this.addEventConfig);
  }

  onRegionPerilItemAdded(event: any): void {
    console.log('Region peril added:', event);
  }

  onIndustryLossOptionAdded(event: any): void {
    console.log('Industry loss added:', event);
  }

  onHiscoxImpactOptionAdded(event: any): void {
    console.log('Hiscox impact added:', event);
  }

  isRDS(): boolean {
    return this.addEventConfig.eventTypeId === EventType.RDS;
  }

  isNewEvent(): boolean {
    return this.addEventConfig.eventTypeId === EventType.NewEvent;
  }

  isNewEventResponse(): boolean {
    return this.addEventConfig.eventTypeId === EventType.NewEventResponse;
  }
}
