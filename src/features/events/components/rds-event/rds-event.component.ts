import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableSortOrder } from "ng-zorro-antd/table";
import { delay, Observable, of, take } from "rxjs";
import { Event, EventService } from "../../../../shared/api-services/nds-api/generated";

interface EventItem {
    id: number;
    type: string;
    name: string;
    regionPeril: string;
    date: string;
    industryLoss: number;
    hiscoxImpact: string;
    lossPick: string;
    createdBy: string;
    createdDate: string;
    restricted: boolean;
    archived: boolean;
    disabled: boolean;
    checked: boolean;
}

@Component({
    selector: 'app-rds-event',
    templateUrl: './rds-event.component.html',
    styleUrls: ['./rds-event.component.scss']
})
export class RdsEventComponent implements OnInit {
    isActive = true;
    expandIconPosition: 'start' | 'end' = 'end';
    eventForm: FormGroup;
    rdsPanel = [
        {
            active: true,
            name: 'RDS',
            disabled: false
        },
    ];

    rdsPanelTable = [
        {
            active: true,
            name: 'RDS SET',
            disabled: false
        },
    ];


    title = 'Event Catalog';
    events$: Observable<EventItem[]>;
    eventsData: EventItem[] = [];
    filteredData: EventItem[] = [];
    loading = true;

    // Form-related properties
    eventName: string = '';
    selectedIndustryLoss: number | null = null;
    selectedHiscoxImpact: string[] = [];
    selectedRegion: string | null = null;
    eventDate: Date | null = null;

    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;

    checked = false;
    indeterminate = false;
    listOfCurrentPageData: EventItem[] = [];
    setOfCheckedId = new Set<number>();

    industryLossOptions = [5, 10, 20];
    hiscoxImpactOptions = ['Low', 'Medium', 'High'];
    regionOptions = ['North America Hurricane', 'Europe Flood', 'Asia Earthquake'];

    sortOrder: NzTableSortOrder = null;
    sortColumn: string = '';

    typeFilters = [
        { text: 'Response Scenario', value: 'Response Scenario' },
        { text: 'Post Event', value: 'Post Event' },
        { text: 'RDS', value: 'RDS' },
        { text: 'Specific', value: 'Specific' }
    ];

    yesNoFilters = [
        { text: 'Yes', value: true },
        { text: 'No', value: false }
    ];

    constructor(private fb: FormBuilder, private eventService: EventService, private notification: NzNotificationService) {
        this.eventForm = this.fb.group({
            eventName: ['', Validators.required]
        });

        this.events$ = of(this.generateMockEvents(50)).pipe(delay(500));
    }
    ngOnInit(): void {
        this.events$.subscribe(events => {
            this.eventsData = events.map(event => ({ ...event, checked: false }));
            this.filteredData = [...this.eventsData];
            this.total = this.eventsData.length;
            this.applyPaginationAndSorting();
            this.loading = false;
        });
    }

    onSortChange(column: string, order: NzTableSortOrder) {
        this.sortColumn = column;
        this.sortOrder = order;
        this.filteredData = [...this.filteredData].sort((a: any, b: any) => {
            const compare = this.compareValues(a[column], b[column]);
            return this.sortOrder === 'ascend' ? compare : -compare;
        });
    }

    // Helper function for sorting
    compareValues(a: any, b: any): number {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
        }
        return a - b;
    }

    // Filtering functions
    filterByType(filter: string, event: EventItem): boolean {
        this.filteredData = this.filteredData.filter(x => x.type === filter);
        return event.type === filter;
    }

    filterByRestricted(filter: boolean, event: EventItem): boolean {
        return event.restricted === filter;
    }

    filterByArchived(filter: boolean, event: EventItem): boolean {
        return event.archived === filter;
    }

    toggleActive(): void {
        this.isActive = !this.isActive;
    }

    onSubmit(): void {
        if (this.eventForm.valid) {
            console.log('Form Value:', this.eventForm.value);

            const event: Event = {
                eventId: undefined,
                eventTypeId: null,
                regionPerilId: null,
                name: this.eventForm.value,
                description: null,
                eventDate: null,
                industryLossEstimate: null,
                hiscoxLossImpact: null,
                isRestrictedAccess: false,
                isArchived: false,
                createUserId: null,
                createDate: null,
                createUser: undefined,
                eventType: undefined
            }

            this.eventService.createEvent(event).pipe(take(1)).subscribe({
                next: (data) => {
                    this.notification.success(
                        'Event Added',
                        'The event was added successfully!'
                    );
                    console.log('Added new event:', data);
                    this.eventForm.reset(); // Optionally reset the form on success
                },
                error: (err) => {
                    this.notification.error(
                        'Submission Failed',
                        'Failed to add the event. Please try again later.'
                    );
                    console.error('Error adding event:', err);
                    this.eventForm.reset();
                }
            });
        } else {
            this.notification.warning(
                'Validation Warning',
                'Please fill in the required fields.'
            );
        }
    }

    get eventNameControl() {
        return this.eventForm.get('eventName');
    }



    generateMockEvents(count: number): EventItem[] {
        const eventTypes = ['Response Scenario', 'Post Event', 'RDS', 'Specific'];
        const createdBy = 'Mock User';

        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            type: eventTypes[i % eventTypes.length],
            name: `Event ${i + 1}`,
            regionPeril: this.regionOptions[i % this.regionOptions.length],
            date: new Date(2024, 9, 1 + (i % 30)).toISOString().slice(0, 10),
            industryLoss: this.industryLossOptions[i % this.industryLossOptions.length],
            hiscoxImpact: this.hiscoxImpactOptions[i % this.hiscoxImpactOptions.length],
            lossPick: `Pick ${i + 1}`,
            createdBy: createdBy,
            createdDate: new Date(2024, 5, 1).toISOString().slice(0, 10),
            restricted: i % 2 === 0,
            archived: i % 3 === 0,
            checked: false,
            disabled: false,
        }));
    }

    updateCheckedSet(id: number, checked: boolean): void {
        const event = this.eventsData.find(item => item.id === id);
        if (event) {
            event.checked = checked;
        }
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onCurrentPageDataChange(event: any): void {
        this.listOfCurrentPageData = event;
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
        this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked: boolean): void {
        this.listOfCurrentPageData.forEach(({ id }) => this.updateCheckedSet(id, checked));
        this.refreshCheckedStatus();
    }

    onPageIndexChange(event: any): void {
        this.pageIndex = event;
        this.applyPagination();
    }

    onPageSizeChange(pageSize: number | 'All'): void {
        this.pageSize = pageSize === 'All' ? this.eventsData.length : pageSize; // Set pageSize to total items if 'All' is selected
        this.pageIndex = 1; // Reset to the first page
        this.applyPagination();
    }

    applyPagination(): void {
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = this.pageSize === this.eventsData.length ? this.eventsData.length : start + this.pageSize; // Adjust end for 'All'
        this.filteredData = this.eventsData.slice(start, end);
    }

    applyPaginationAndSorting(): void {
        this.applyPagination();
    }

    addToCatalog(): void {
        console.log('Add to catalog action triggered');
    }
}