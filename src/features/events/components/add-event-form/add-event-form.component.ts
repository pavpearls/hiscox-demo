import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { IconsProviderModule } from '../../../../app/icons-provider.module';

export interface AddEventConfig {
  regionOptions: string[];
  impactOptions: string[];
  allowMultipleEvents: boolean;
  labels?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: string;
    industryLoss?: string;
    hiscoxImpact?: string;
  };
  errorMessages?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: string;
    industryLoss?: string;
    hiscoxImpact?: string;
  };
  presetValues?: {
    eventName?: string;
    regionPeril?: string;
    eventDate?: Date;
    events?: { industryLoss?: string; hiscoxImpact?: string }[];
  };
}

export interface EventGroup {
  industryLoss: FormControl<string>;
  hiscoxImpact: FormControl<string | null>;
}

export interface AddEventForm {
  eventName: FormControl<string>;
  regionPeril: FormControl<string | null>;
  eventDate: FormControl<Date | null>;
  events: FormArray<FormGroup<EventGroup>>;
}

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

  ],
  templateUrl: './add-event-form.component.html',
  styleUrls: ['./add-event-form.component.scss']
})
export class AddEventFormComponent implements OnInit {
  @Input({ required: true }) addEventConfig!: AddEventConfig;
  @Output() onEventAdded = new EventEmitter<any>();

  eventForm!: FormGroup<{
    eventName: FormControl<string>;
    regionPeril: FormControl<string | null>;
    eventDate: FormControl<Date | null>;
    events: FormArray<FormGroup<{
      industryLoss: FormControl<string>;
      hiscoxImpact: FormControl<string | null>;
    }>>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  get events(): FormArray<FormGroup<{
    industryLoss: FormControl<string>;
    hiscoxImpact: FormControl<string | null>;
  }>> {
    return this.eventForm.get('events') as FormArray<FormGroup<{
      industryLoss: FormControl<string>;
      hiscoxImpact: FormControl<string | null>;
    }>>;
  }

  initForm(): void {
    const { presetValues } = this.addEventConfig;
    this.eventForm = this.fb.group({
      eventName: this.fb.control(presetValues?.eventName || '', Validators.required),
      regionPeril: this.fb.control<string | null>(presetValues?.regionPeril || null, Validators.required),
      eventDate: this.fb.control<Date | null>(presetValues?.eventDate || new Date(), Validators.required),
      events: this.fb.array(
        (presetValues?.events || []).map(event => 
          this.fb.group({
            industryLoss: this.fb.control(event.industryLoss || '', Validators.required),
            hiscoxImpact: this.fb.control<string | null>(event.hiscoxImpact || null, Validators.required)
          })
        )
      )
    });

    if(this.addEventConfig.allowMultipleEvents) {
      this.addEvent();
    }
  }

  addEvent(): void {
    const eventGroup = this.fb.group({
      industryLoss: this.fb.control('', Validators.required),
      hiscoxImpact: this.fb.control<string | null>(null, Validators.required)
    });
    this.events.push(eventGroup);
  }

  removeEvent(index: number): void {
    if (this.events.length > 1) {
      this.events.removeAt(index);
    } 
  }

  addToCatalog(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.getRawValue();
      console.log('Form Data:', formData);
      this.onEventAdded.emit(formData);
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    const { presetValues } = this.addEventConfig;
  
    this.eventForm.reset({
      eventName: presetValues?.eventName || '',
      regionPeril: presetValues?.regionPeril || null,
      eventDate: presetValues?.eventDate || new Date(),
    });
  
    this.events.clear();
  
    (presetValues?.events || [{}]).forEach(event => {
      this.events.push(this.fb.group({
        industryLoss: this.fb.control(event.industryLoss || '', Validators.required),
        hiscoxImpact: this.fb.control<string | null>(event.hiscoxImpact || null, Validators.required)
      }));
    });
  
    if (this.addEventConfig.allowMultipleEvents && this.events.length === 0) {
      this.addEvent();
    }
  }
}
