import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddEventConfig, AddEventForm, EventDetailsForm } from "../interfaces/events.interfaces";

@Injectable()
export class AddEventFormService {
    constructor(private fb: FormBuilder) { }

    // Initialize the event form group
    initEventForm(config: AddEventConfig): FormGroup<AddEventForm> {
        const { presetValues } = config;
        const formGroup = this.fb.nonNullable.group<AddEventForm>({
            eventTypeId: this.fb.nonNullable.control(config.eventTypeId || '', Validators.required),
            eventName: this.fb.nonNullable.control(presetValues?.eventName || '', Validators.required),
            regionPeril: this.fb.control<string | null>(presetValues?.regionPeril || null, Validators.required),
            eventDate: this.fb.control<Date | null>(presetValues?.eventDate || new Date(), Validators.required),
            events: this.fb.array(
                (presetValues?.events || []).map(event =>
                    this.createEventDetailsGroup(event.industryLoss || '', event.hiscoxImpact || null)
                )
            ) as FormArray<FormGroup<EventDetailsForm>>
        });

        if (config.allowMultipleEvents && formGroup.controls.events.length === 0) {
            this.addEvent(formGroup);
        }

        return formGroup;
    }

    // Create a single event details group
    private createEventDetailsGroup(industryLoss: string = '', hiscoxImpact: string | null = null): FormGroup<EventDetailsForm> {
        return this.fb.nonNullable.group<EventDetailsForm>({
            industryLoss: this.fb.nonNullable.control(industryLoss, Validators.required),
            hiscoxImpact: this.fb.control<string | null>(hiscoxImpact, Validators.required)
        });
    }

    // Add an event to the form array
    addEvent(formGroup: FormGroup<AddEventForm>): void {
        const events = formGroup.controls.events;
        events.push(this.createEventDetailsGroup());
    }

    // Remove an event from the form array
    removeEvent(formGroup: FormGroup<AddEventForm>, index: number): void {
        const events = formGroup.controls.events;
        if (events.length > 1) {
            events.removeAt(index);
        }
    }

    // Reset the form with preset values
    resetForm(formGroup: FormGroup<AddEventForm>, config: AddEventConfig): void {
        const { presetValues } = config;

        formGroup.reset({
            eventTypeId: config.eventTypeId || '',
            eventName: presetValues?.eventName || '',
            regionPeril: presetValues?.regionPeril || null,
            eventDate: presetValues?.eventDate || new Date(),
        });

        const eventsArray = formGroup.controls.events;
        eventsArray.clear();

        (presetValues?.events || [{}]).forEach(event => {
            eventsArray.push(this.createEventDetailsGroup(event.industryLoss || '', event.hiscoxImpact || null));
        });

        if (config.allowMultipleEvents && eventsArray.length === 0) {
            this.addEvent(formGroup);
        }
    }
}