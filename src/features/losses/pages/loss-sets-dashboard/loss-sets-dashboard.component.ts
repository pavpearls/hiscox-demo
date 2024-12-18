import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IDetailCellRendererParams,
} from 'ag-grid-community';

@Component({
  selector: 'app-loss-sets-dashboard',
  templateUrl: './loss-sets-dashboard.component.html',
  styleUrls: ['./loss-sets-dashboard.component.scss'],
})
export class LossSetsDashboardComponent implements OnInit {
  public rowData: any[] = [];
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = { flex: 1, resizable: true, sortable: true };

  private gridApi!: GridApi;
  isAddLossSetModalVisible = false;
  selectedOption: 'Loss Set' | 'Loss Set Version' | null = null;
  constructor() {}

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
      { field: 'lossSet', headerName: 'Loss Set', rowGroup: true, hide: true },
      { field: 'version', headerName: 'Version', rowGroup: true, hide: true },
      { field: 'versionDetails', headerName: 'Version Details', rowGroup: true, hide: true },
      { field: 'loadId', headerName: 'Load ID' },
      { field: 'lossLoadName', headerName: 'Load Name', flex: 2 },
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
      { field: 'totalRecords', headerName: 'Total Records', valueFormatter: this.formatNumber },
      { field: 'totalLoss', headerName: 'Total Loss', valueFormatter: this.formatCurrency },
    ];
  }

  private loadMockData(): void {
    const MOCK_DATA = [
      {
        lossSet: 'Beryl',
        versions: [
          {
            version: '2024-Nov',
            subVersions: [
              {
                versionDetails: 'Beryl Losses for 2024-Nov',
                records: [
                  {
                    loadId: 724,
                    lossLoadName: 'POLICY_LIST__Beryl__2024_11__Beryl Reported Losses - UK - Q4',
                    dataProvider: 'Claims',
                    uploadUser: 'Tom Clements',
                    uploadDate: '2024-Nov',
                    valid: 'Yes',
                    totalRecords: 24065,
                    totalLoss: '42,267,054,727',
                  },
                  {
                    loadId: 725,
                    lossLoadName: 'POLICY_LIST__Beryl__2024_11__Beryl Reported Losses - UK - Q3',
                    dataProvider: 'Claims',
                    uploadUser: 'Tom Clements',
                    uploadDate: '2024-Nov',
                    valid: 'Yes',
                    totalRecords: 53720,
                    totalLoss: '5,933,740,033',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    this.rowData = MOCK_DATA.flatMap((lossSet) =>
      lossSet.versions.flatMap((version) =>
        version.subVersions.flatMap((subVersion) =>
          subVersion.records.map((record) => ({
            ...record,
            lossSet: lossSet.lossSet,
            version: version.version,
            versionDetails: subVersion.versionDetails,
          }))
        )
      )
    );
  }

  private formatNumber(params: any): string {
    return params.value ? params.value.toLocaleString() : '';
  }

  private formatCurrency(params: any): string {
    return params.value ? `$${params.value.toLocaleString()}` : '';
  }

  onCopyClick(): void {
    console.log('Copy clicked');
  }

  onEditClick(): void {
    console.log('Edit clicked');
  }

  onCreateLossSet() {
    this.selectedOption = 'Loss Set';
    this.isAddLossSetModalVisible = true;
  }
  
  onCreateLossSetVersion() {
    this.selectedOption = 'Loss Set Version';
    this.isAddLossSetModalVisible = true;
  }

  showAddLossSetModal() {
    this.isAddLossSetModalVisible = true;
  }

  saveNewLossSet(data: any) {
    console.log('Saving new Loss Set:', data);
    this.isAddLossSetModalVisible = false;
  }
}
