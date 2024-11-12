import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddEventConfig, AddEventForm, EventDetailsForm } from '@events//interfaces/events.interfaces';
import { AddEventFormService } from '@events//services/add-event-form.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IconsProviderModule } from '../../../../../app/icons-provider.module';

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
  eventForm!: FormGroup<AddEventForm>;

  constructor(private eventsFormsService: AddEventFormService) { }

  ngOnInit(): void {
    this.eventForm = this.eventsFormsService.initEventForm(this.addEventConfig);
  }

  get events(): FormArray<FormGroup<EventDetailsForm>> {
    return this.eventForm.controls.events;
  }

  addEvent(): void {
    this.eventsFormsService.addEvent(this.eventForm);
  }

  removeEvent(index: number): void {
    this.eventsFormsService.removeEvent(this.eventForm, index);
  }

  addToCatalog(): void {
    this.eventForm.valid
      ? this.onEventAdded.emit(this.eventForm.getRawValue())
      : this.eventForm.markAllAsTouched();
  }

  resetForm(): void {
    this.eventsFormsService.resetForm(this.eventForm, this.addEventConfig);
  }
}
