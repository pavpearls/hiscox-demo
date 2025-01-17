import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventsFacade } from '@events/store/events.facade';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { LossFacade } from 'features/losses/store/losses.facade';
import { forkJoin } from 'rxjs';
import { filterSuccess } from 'ngx-remotedata';
import { takeWhile, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-losses-dashboard',
  templateUrl: './losses-dashboard.component.html',
  styleUrls: ['./losses-dashboard.component.scss'],
})
export class LossesDashboardComponent implements OnInit, OnDestroy {
  title = 'Losses Dashboard';
  isModalVisible = false;
  isComponentAlive = true;

  public rowData: any[] = [];
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1, sortable: true, resizable: true };
  private gridApi!: GridApi;

  isLoading = true;
  grossLossListResponse$ = this.lossFacade.state.grossLoss.getGrossLossList$;
  getEventSetListResponse$ = this.eventsFacade.state.eventSets.getEventSetList$;

  constructor(private lossFacade: LossFacade, private eventsFacade: EventsFacade) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.fetchAndTransformData();

    this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$
      .pipe(takeWhile(() => this.isComponentAlive), filterSuccess())
      .subscribe(() => {
        this.refreshData();
      });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    setTimeout(() => {
      this.gridApi.autoSizeAllColumns();
    });
  }

  private initializeColumns(): void {
    this.columnDefs = [
      { field: 'eventCategory', headerName: 'Category', rowGroup: true, hide: true },
      { field: 'loadId', headerName: 'Load ID' },
      { field: 'lossLoadName', headerName: 'Loss Load Name', flex: 2 },
      { field: 'eventSet', headerName: 'Event Set' },
      { field: 'eventName', headerName: 'Event Name' }, // New Column for Event Name
      { field: 'eventSetType', headerName: 'Event Set Type' },
      { field: 'dataProvider', headerName: 'Data Provider' },
      { field: 'uploadUser', headerName: 'Upload User' },
      { field: 'uploadDate', headerName: 'Upload Date' },
      {
        field: 'valid',
        headerName: 'Valid',
        cellStyle: (params) => ({
          color: params.value === 'Yes' ? 'green' : 'red',
          textAlign: 'center',
        }),
      },
    ];
  }

  private fetchAndTransformData(): void {
    this.isLoading = true;

    forkJoin({
      grossLossList: this.grossLossListResponse$.pipe(filterSuccess(), take(1)),
      eventSetList: this.getEventSetListResponse$.pipe(filterSuccess(), take(1)),
    }).subscribe({
      next: ({ grossLossList, eventSetList }) => {
        const transformedData = this.transformDataForGrid(grossLossList.value, eventSetList.value);
        this.rowData = transformedData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error combining data:', err);
        this.isLoading = false;
      },
    });
  }

  private transformDataForGrid(grossLossList: any[], eventSetList: any[]): any[] {
    // Create a map for eventSetID to eventNameShort and eventSetName
    const eventSetMapping: { [key: string]: { eventNameShort: string, eventSetName: string } } = {};
    eventSetList.forEach((eventSet) => {
      eventSet.events.forEach((event) => {
        eventSetMapping[event.eventID] = {
          eventNameShort: event.eventNameShort,
          eventSetName: eventSet.eventSetName,
        };
      });
    });

    // Transform and merge data
    const groupedData = grossLossList.reduce((acc, obj) => {
      const category = obj.eventSetID || 'Unknown';

      if (!acc[category]) {
        acc[category] = {
          eventCategory: eventSetMapping[obj.eventSetID]?.eventSetName || `Event Set ${category}`,
          events: [],
        };
      }

      acc[category].events.push({
        loadId: obj.lossLoadID,
        lossLoadName: obj.lossLoadName || 'N/A',
        eventSet: obj.eventSetID || 'N/A',
        eventName: eventSetMapping[obj.eventSetID]?.eventNameShort || 'N/A', // Map Event Name
        eventSetType: 'Post Event',
        dataProvider: obj.dataProducerID || 'N/A',
        uploadUser: obj.createdBy || 'Unknown',
        uploadDate: obj.loadDate
          ? new Date(obj.loadDate).toLocaleDateString()
          : '',
        valid: obj.isValid ? 'Yes' : 'No',
      });

      return acc;
    }, {});

    return Object.values(groupedData).flatMap((category: any) =>
      category.events.map((event: any) => ({
        ...event,
        eventCategory: category.eventCategory,
      }))
    );
  }

  onUploadLossFile(): void {
    this.isModalVisible = true;
  }

  refreshData(): void {
    this.fetchAndTransformData();
  }

  handleModalOk($event: any): void {
    this.isModalVisible = false;
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}
