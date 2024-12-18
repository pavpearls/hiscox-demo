import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-losses-dashboard',
  templateUrl: './losses-dashboard.component.html',
  styleUrls: ['./losses-dashboard.component.scss']
})
export class LossesDashboardComponent implements OnInit {
  title = 'Losses Dashboard';
  isModalVisible = true;

  public rowData: any[] = [];
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1, sortable: true, resizable: true };
  private gridApi!: GridApi;

  ngOnInit(): void {
    this.initializeColumns();
    this.loadMockData();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.autoSizeAllColumns();
  }

  private initializeColumns(): void {
    this.columnDefs = [
      { field: 'eventCategory', headerName: 'Category', rowGroup: true, hide: true },
      { field: 'loadId', headerName: 'Load ID' },
      { field: 'lossLoadName', headerName: 'Loss Load Name', flex: 2 },
      { field: 'eventSet', headerName: 'Event Set' },
      { field: 'eventSetType', headerName: 'Event Set Type' },
      { field: 'dataProvider', headerName: 'Data Provider' },
      { field: 'uploadUser', headerName: 'Upload User' },
      { field: 'uploadDate', headerName: 'Upload Date' },
      {
        field: 'valid',
        headerName: 'Valid',
        cellStyle: (params) => ({
          color: params.value === 'Yes' ? 'green' : 'red',
          textAlign: 'center'
        }),
      },
    ];
  }

  private loadMockData(): void {
    const MOCK_DATA = [
      {
        eventCategory: 'Beryl',
        events: [
          {
            loadId: 724,
            lossLoadName: 'POLICY_LIST__Beryl__2024_11__Beryl Reported Losses - UK - Q4',
            eventSet: 'Beryl',
            eventSetType: 'Post Event',
            dataProvider: 'Claims',
            uploadUser: 'Tom Clements',
            uploadDate: '2024-Nov',
            valid: 'Yes',
          },
          {
            loadId: 726,
            lossLoadName: 'POLICY_LIST__Beryl__2024_11__Beryl Reported Losses - UK - Q3',
            eventSet: 'Beryl',
            eventSetType: 'Post Event',
            dataProvider: 'Claims',
            uploadUser: 'Michael Doyle',
            uploadDate: '2024-Nov',
            valid: 'Yes',
          },
        ],
      },
      {
        eventCategory: 'COVID',
        events: [
          {
            loadId: 901,
            lossLoadName: 'POLICY_LIST__COVID__2024_02__Business Unit 1',
            eventSet: 'COVID',
            eventSetType: 'Post Event',
            dataProvider: 'Claims',
            uploadUser: 'Tom Clements',
            uploadDate: '2024-Feb',
            valid: 'Yes',
          },
        ],
      },
    ];

    this.rowData = MOCK_DATA.flatMap((category) =>
      category.events.map((event) => ({
        ...event,
        eventCategory: category.eventCategory,
      }))
    );
  }

  handleModalOk($event: any) {

  }

  handleModalCancel() {
    
  }
  
}