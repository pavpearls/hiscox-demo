import { Component, Input, OnInit } from '@angular/core';
import { EventSet } from '@shared/api-services/eventSet';
import { Observable, of } from 'rxjs';

interface ParentItemData {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number | string;
  creator: string;
  createdAt: string;
  expand: boolean;
}

interface ChildrenItemData {
  key: number;
  name: string;
  date: string;
  upgradeNum: string;
  status: string;
}

import { ColDef, GridReadyEvent } from 'ag-grid-community';



@Component({
  selector: 'app-nested-table',
  templateUrl: './set-events-table.component.html',
})
export class NestedTableComponent {
  rowData$: Observable<Array<EventSet>>;
  private gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      field: 'eventSetName',
      headerName: 'Event Set Name',
      sortable: true,
      filter: true,
    },
    {
      field: 'eventSetDescription',
      headerName: 'Description',
      sortable: true,
      filter: true,
    },
    {
      field: 'createDate',
      headerName: 'Created Date',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      },
    },
  ];

  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { field: 'eventID', headerName: 'Event ID' },
        { field: 'simYear', headerName: 'Simulation Year' },
        { field: 'eventOrder', headerName: 'Order' },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
      },
    },
    getDetailRowData: (params: any) => {
      params.successCallback(params.data.eventSetMembers || []);
    },
  };

  constructor() {
    this.rowData$ = of(this.mockEventSets());
  }

  mockEventSets(): EventSet[] {
    return [
      {
        eventSetID: 1,
        eventSetName: 'Flood Event Set',
        eventSetDescription: 'Set of flood events',
        createDate: new Date(),
        eventSetMembers: [
          { eventID: 101, simYear: 2021, eventOrder: 1 },
          { eventID: 102, simYear: 2022, eventOrder: 2 },
        ],
      },
      {
        eventSetID: 2,
        eventSetName: 'Earthquake Event Set',
        eventSetDescription: 'Set of earthquake events',
        createDate: new Date(),
        eventSetMembers: [
          { eventID: 201, simYear: 2020, eventOrder: 1 },
          { eventID: 202, simYear: 2021, eventOrder: 2 },
        ],
      },
    ];
  }

  dateFormatter(params: any) {
    return params.value ? new Date(params.value).toLocaleDateString() : '';
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.autoSizeAllColumns(); 
  }
}