import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddEventConfig, AddEventForm, EventDetailsForm } from "../interfaces/events.interfaces";

export enum EventType {
    RDS = '1',
    NewEvent = '2',
    NewEventResponse = '3',
}

@Injectable()
export class AddEventFormService {
    constructor(private fb: FormBuilder) { }

    initEventForm(config: AddEventConfig): FormGroup<Partial<AddEventForm>> {
        const { presetValues, eventTypeId } = config;

        const formGroup = this.fb.nonNullable.group<Partial<AddEventForm>>({
            eventTypeId: this.fb.nonNullable.control(eventTypeId || '', Validators.required),
        });

        switch (eventTypeId) {
            case EventType.RDS:
                formGroup.addControl(
                    'eventName',
                    this.fb.nonNullable.control(presetValues?.eventName || '', Validators.required)
                );
                formGroup.addControl(
                    'regionPeril',
                    this.fb.control<string | null>(presetValues?.regionPeril || null, Validators.required)
                );
                break;

            case EventType.NewEvent:
                formGroup.addControl(
                    'eventName',
                    this.fb.nonNullable.control(presetValues?.eventName || '', Validators.required)
                );
                formGroup.addControl(
                    'regionPeril',
                    this.fb.control<string | null>(presetValues?.regionPeril || null, Validators.required)
                );
                formGroup.addControl(
                    'eventDate',
                    this.fb.control<Date | null>(presetValues?.eventDate || new Date(), Validators.required)
                );
                break;

            case EventType.NewEventResponse:
            default:
                formGroup.addControl(
                    'eventName',
                    this.fb.nonNullable.control(presetValues?.eventName || '', Validators.required)
                );
                formGroup.addControl(
                    'regionPeril',
                    this.fb.control<string | null>(presetValues?.regionPeril || null, Validators.required)
                );
                formGroup.addControl(
                    'eventDate',
                    this.fb.control<Date | null>(presetValues?.eventDate || new Date(), Validators.required)
                );
                formGroup.addControl(
                    'events',
                    this.fb.array(
                        (presetValues?.events || []).map(event =>
                            this.createEventDetailsGroup(event.industryLoss || '', event.hiscoxImpact || null)
                        )
                    ) as FormArray<FormGroup<EventDetailsForm>>
                );

                if (config.allowMultipleEvents && !presetValues?.events?.length) {
                    this.addEvent(formGroup as any);
                }
                break;
        }

        return formGroup as FormGroup<Partial<AddEventForm>>;
    }

    private createEventDetailsGroup(industryLoss: string = '', hiscoxImpact: string | null = null): FormGroup<EventDetailsForm> {
        return this.fb.nonNullable.group<EventDetailsForm>({
            industryLoss: this.fb.nonNullable.control(industryLoss, Validators.required),
            hiscoxImpact: this.fb.control<string | null>(hiscoxImpact, Validators.required)
        });
    }

    // Add an event to the form array
    addEvent(formGroup: FormGroup<Partial<AddEventForm>>): void {
        const events = formGroup?.controls?.events;
        if (events) {
            events.push(this.createEventDetailsGroup());
        }
    }

    // Remove an event from the form array
    removeEvent(formGroup: FormGroup<Partial<AddEventForm>>, index: number): void {
        const events = formGroup?.controls?.events;
        if (events) {
            if (events.length > 1) {
                events.removeAt(index);
            }
        }
    }

    // Reset the form with preset values
    resetForm(formGroup: FormGroup<Partial<AddEventForm>>, config: AddEventConfig): void {
        const { presetValues } = config;

        formGroup.reset({
            eventTypeId: config.eventTypeId || '',
            eventName: presetValues?.eventName || '',
            regionPeril: presetValues?.regionPeril || null,
            eventDate: presetValues?.eventDate || new Date(),
        });

        const eventsArray = formGroup?.controls?.events;
        if (eventsArray) {
            eventsArray.clear();

            (presetValues?.events || [{}]).forEach(event => {
                eventsArray.push(this.createEventDetailsGroup(event.industryLoss || '', event.hiscoxImpact || null));
            });

            if (config.allowMultipleEvents && eventsArray.length === 0) {
                this.addEvent(formGroup);
            }
        }
    }
}