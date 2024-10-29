import { Component, OnInit } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

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
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {
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

  constructor() {
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

  onPageIndexChange(event: number): void {
    this.pageIndex = event;
    this.applyPagination();
  }

  onPageSizeChange(event: number): void {
    this.pageSize = event;
    this.pageIndex = 1;
    this.applyPagination();
  }

  applyPagination(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = this.pageIndex * this.pageSize;
    this.filteredData = this.eventsData.slice(start, end);
  }

  applyPaginationAndSorting(): void {
    this.applyPagination();
  }

  addToCatalog(): void {
    console.log('Add to catalog action triggered');
  }
}
