import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddEventConfig, AddEventForm, EventDetailsForm } from '@events//interfaces/events.interfaces';
import { AddEventFormService } from '@events//services/add-event-form.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IconsProviderModule } from '../../../../app/icons-provider.module';
import { SelectDropdownWithAddOptionComponent } from 'shared/ui-components/ng-zorro-select-dropdown-with-add-option/ng-zorro-select-dropdown-with-add-option.component';
import { EventsFacade } from '@events//store/events.facade';

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
    SelectDropdownWithAddOptionComponent
  ],
  templateUrl: './add-event-form.component.html',
  styleUrls: ['./add-event-form.component.scss']
})
export class AddEventFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) addEventConfig!: AddEventConfig;
  @Output() onEventAdded = new EventEmitter<any>();
  eventForm!: FormGroup<AddEventForm>;
  regionPerilOptions:string[] = [];
  hiscoxImpactOptions: string[] = [];
  industryLossOptions: number[] = [];
  constructor(private eventsFormsService: AddEventFormService) { }
  
  ngOnInit(): void {
    this.eventForm = this.eventsFormsService.initEventForm(this.addEventConfig);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addEventConfig']) {
      this.eventForm = this.eventsFormsService.initEventForm(this.addEventConfig);
      this.regionPerilOptions = [...this.addEventConfig.regionPerilOptions.map(x =>x.displayValue)];
      this.industryLossOptions = [...this.addEventConfig.industryLossOptions.map(x =>Number(x.displayValue))];
      this.hiscoxImpactOptions = [...this.addEventConfig.hiscoxImpactOptions.map(x =>x.displayValue)];
    }
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

  onRegionPerilItemAdded($event: any): void {
    // TODO add region peril to DB
  }

  onIndustryLossOptionAdded($event: any): void {

  }

  onHiscoxImpactOptionAdded($event: any): void {

  }


}
