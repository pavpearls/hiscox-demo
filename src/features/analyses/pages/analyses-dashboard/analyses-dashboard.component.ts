import { Component, OnInit } from '@angular/core';
import { AnalysesFacade } from '../../store/analyses.facade';
import { Observable } from 'rxjs';
import { isSuccess, RemoteData } from 'ngx-remotedata';
import { HttpErrorResponse } from '@angular/common/http';

interface AnalysisItem {
  id: number;
  state: string;
  name: string;
  type: string;
  eventSetId: string;
  lossSetId: string;
  riSetId: string;
  owner: string;
  asOfDate: string;
  lastUpdate: string;
  inUse: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-analyses-dashboard',
  templateUrl: './analyses-dashboard.component.html',
  styleUrls: ['./analyses-dashboard.component.scss']
})
export class AnalysesDashboardComponent implements OnInit {
  title = 'Analyses Dashboard';
  analyses$: Observable<RemoteData<AnalysisItem[], HttpErrorResponse>>;
  analysesData: AnalysisItem[] = [];
  filteredData: AnalysisItem[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: AnalysisItem[] = [];
  setOfCheckedId = new Set<number>();
  loading = false;

  selectedAction: string = ''; 

  sortKey: string | null = null;
sortOrder: string | null = null;

  listOfColumns = [
    {
      name: 'ID',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.id - b.id,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'State',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.state.localeCompare(b.state),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: '(Run)', value: '(Run)' },
        { text: '(O)Created', value: '(O)Created' }
      ],
      filterFn: (list: string[], item: AnalysisItem) => list.some(state => item.state === state)
    },
    {
      name: 'Analysis Name',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Analysis Type',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.type.localeCompare(b.type),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Post Event', value: 'Post Event' },
        { text: 'Event Response', value: 'Event Response' },
        { text: 'RDS', value: 'RDS' }
      ],
      filterFn: (list: string[], item: AnalysisItem) => list.some(type => item.type === type)
    },
    {
      name: 'Event Set ID',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.eventSetId.localeCompare(b.eventSetId),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Loss Set ID',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.lossSetId.localeCompare(b.lossSetId),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'RI Set ID',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.riSetId.localeCompare(b.riSetId),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Owner',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.owner.localeCompare(b.owner),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'As Of Date',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => new Date(a.asOfDate).getTime() - new Date(b.asOfDate).getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Last Update',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'In Use',
      sortOrder: null,
      sortFn: (a: AnalysisItem, b: AnalysisItem) => a.inUse.localeCompare(b.inUse),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' }
      ],
      filterFn: (list: string[], item: AnalysisItem) => list.some(inUse => item.inUse === inUse)
    }
  ];

  constructor(private analysesFacade: AnalysesFacade) {
    this.analyses$ = this.analysesFacade.analyses$;
  }

  ngOnInit(): void {
    this.analysesFacade.loadAnalyses();
    this.analyses$.subscribe(remoteData => {
      if (isSuccess(remoteData)) {
        this.analysesData = remoteData.value || [];
        this.filteredData = [...this.analysesData];
        this.total = this.analysesData.length;
        this.applyPaginationAndSorting();
      } else {
        this.analysesData = [];
        this.filteredData = [];
      }
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
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
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    const selectedItems = this.analysesData.filter(item => this.setOfCheckedId.has(item.id));
    console.log('Selected Items:', selectedItems);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  onPageIndexChange(event: any): void {
    this.pageIndex = event;
    this.applyPagination();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event;
    this.pageIndex = 1;
    this.applyPagination();
  }

  applyPagination(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = this.pageIndex * this.pageSize;
    this.filteredData = this.analysesData.slice(start, end);
  }

  onSelect(action: string): void {
    this.selectedAction = action;
    console.log(`Selected Action: ${action}`);
    switch (action) {
      case 'Event Response':
        break;
      case 'Post Event':
        break;
      case 'RDS':
        break;
      case 'Scenario':
        break;
      case 'Specific':
        break;
      default:
        break;
    }
  }

  onCopy(): void {
    console.log('Copy action triggered');
  }

  onDelete(): void {
    console.log('Delete action triggered');
  }

  onArchive(): void {
    console.log('Archive action triggered');
  }

  applySorting(sortKey: string, sortOrder: any | null): void {
    this.sortKey = sortKey;
    this.sortOrder = sortOrder;

    const sortFn = this.listOfColumns.find(col => col.name === sortKey)?.sortFn;
    if (sortFn && sortOrder) {
      this.filteredData = this.filteredData.sort((a, b) => {
        if (sortOrder === 'ascend') {
          return sortFn(a, b);
        } else if (sortOrder === 'descend') {
          return sortFn(b, a);
        }
        return 0;
      });
    }
  }

  applyPaginationAndSorting(): void {
    if (this.sortKey && this.sortOrder) {
      this.applySorting(this.sortKey, this.sortOrder);
    }
  
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = this.pageIndex * this.pageSize;
    this.filteredData = this.analysesData.slice(start, end);
  }
}
