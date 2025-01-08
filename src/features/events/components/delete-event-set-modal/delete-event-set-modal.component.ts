import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventSet, Event } from '@shared/api-services/models';
import { ColDef, GridApi, GridReadyEvent, ITextFilterParams, RowSelectionOptions, ValueFormatterParams } from 'ag-grid-community';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-delete-event-set-modal',
  templateUrl: './delete-event-set-modal.component.html',
  styleUrls: ['./delete-event-set-modal.component.scss']
})
export class DeleteEventSetModalComponent implements OnInit {
  mockResponse = [{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":198,"regionPerilTypeID":10,"regionPerilName":"US & Canada Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":24,"eventOrder":1,"eventID":86,"eventTypeID":1,"regionPerilID":198,"eventNameShort":"Canada - Vancouver Earthquake (RDS)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:18:48.267","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":207,"regionPerilTypeID":10,"regionPerilName":"Australia Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":23,"eventOrder":1,"eventID":85,"eventTypeID":1,"regionPerilID":207,"eventNameShort":"Australia - Sydney Earthquake (RDS)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:18:35.043","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":217,"regionPerilTypeID":10,"regionPerilName":"UK Flood","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":22,"eventOrder":1,"eventID":84,"eventTypeID":1,"regionPerilID":217,"eventNameShort":"9 - UK Flood RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:18:23.977","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":208,"regionPerilTypeID":10,"regionPerilName":"Japan Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":21,"eventOrder":1,"eventID":83,"eventTypeID":1,"regionPerilID":208,"eventNameShort":"8 - Japanese Earthquake RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:18:03.447","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":198,"regionPerilTypeID":10,"regionPerilName":"US & Canada Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":20,"eventOrder":1,"eventID":82,"eventTypeID":1,"regionPerilID":198,"eventNameShort":"7 - New Madrid Earthquake RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:17:53.343","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":198,"regionPerilTypeID":10,"regionPerilName":"US & Canada Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":19,"eventOrder":1,"eventID":81,"eventTypeID":1,"regionPerilID":198,"eventNameShort":"6 - San Francisco Earthquake RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:17:46.1","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":198,"regionPerilTypeID":10,"regionPerilName":"US & Canada Earthquake","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":18,"eventOrder":1,"eventID":80,"eventTypeID":1,"regionPerilID":198,"eventNameShort":"6 - Los Angeles Earthquake RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:17:33.8","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":211,"regionPerilTypeID":10,"regionPerilName":"Japan & SE Asia Typhoon","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":17,"eventOrder":1,"eventID":79,"eventTypeID":1,"regionPerilID":211,"eventNameShort":"5 - Japanese Typhoon RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:17:14.943","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":320,"regionPerilTypeID":10,"regionPerilName":"Europe Convective Storm","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":16,"eventOrder":1,"eventID":78,"eventTypeID":1,"regionPerilID":320,"eventNameShort":"4 - European Windstorm RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:17:03.527","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":203,"regionPerilTypeID":10,"regionPerilName":"US & Caribbean Hurricane","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":15,"eventOrder":1,"eventID":77,"eventTypeID":1,"regionPerilID":203,"eventNameShort":"3 - Gulf of Mexico Hurricane RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:51.317","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":203,"regionPerilTypeID":10,"regionPerilName":"US & Caribbean Hurricane","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":14,"eventOrder":1,"eventID":76,"eventTypeID":1,"regionPerilID":203,"eventNameShort":"2 - Florida - Pinellas Hurricane RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:43.33","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":203,"regionPerilTypeID":10,"regionPerilName":"US & Caribbean Hurricane","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":13,"eventOrder":1,"eventID":75,"eventTypeID":1,"regionPerilID":203,"eventNameShort":"2 - Florida - Miami-Dade Hurricane RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:34.707","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":12,"eventOrder":1,"eventID":74,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk D&O - Bad industry practise","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:18.123","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":7,"eventOrder":1,"eventID":69,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk - Rail Collision","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:15:33.09","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":11,"eventOrder":1,"eventID":73,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk (Failure of a US Construction Project)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:12.557","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":10,"eventOrder":1,"eventID":72,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk (Failure of a Major Corporation)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:16:05.303","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":9,"eventOrder":1,"eventID":71,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk (Erosion of Californian Tort Reform - MICRA)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:15:50.26","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":221,"regionPerilTypeID":10,"regionPerilName":"Clash - Liability","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":8,"eventOrder":1,"eventID":70,"eventTypeID":1,"regionPerilID":221,"eventNameShort":"15 - Liability Risk (Broadening of Real Estate Coverage)","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:15:42.22","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":223,"regionPerilTypeID":10,"regionPerilName":"Clash - Aviation","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":6,"eventOrder":1,"eventID":68,"eventTypeID":1,"regionPerilID":223,"eventNameShort":"13 - Aviation Collision","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:15:17.043","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":233,"regionPerilTypeID":10,"regionPerilName":"Clash - Retail","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":5,"eventOrder":1,"eventID":67,"eventTypeID":1,"regionPerilID":233,"eventNameShort":"12 - Major Complex Loss","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:14:53.84","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":227,"regionPerilTypeID":10,"regionPerilName":"Clash - Marine","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":4,"eventOrder":1,"eventID":66,"eventTypeID":1,"regionPerilID":227,"eventNameShort":"11 - Marine Event (1) Cruise Liner","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:14:38.823","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":227,"regionPerilTypeID":10,"regionPerilName":"Clash - Marine","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":3,"eventOrder":1,"eventID":65,"eventTypeID":1,"regionPerilID":227,"eventNameShort":"11 - Marine Event (1) Collision","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:14:30.793","isLossPick":false,"isRestrictedAccess":false,"isArchived":false},{"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeDescription":"RDS","events":[]},"regionPeril":{"regionPerilID":203,"regionPerilTypeID":10,"regionPerilName":"US & Caribbean Hurricane","regionPerilCode":null,"regionPerilType":null,"events":[]},"eventSetMembers":[],"simYear":2,"eventOrder":1,"eventID":64,"eventTypeID":1,"regionPerilID":203,"eventNameShort":"1 - Two Events - South Carolina Hurricane RDS","eventNameLong":"","eventDate":"2024-12-17T00:00:00","industryLossEstimate":null,"hiscoxLossImpactRating":null,"createdBy":"james.mace@hiscox.com","modifiedBy":"","createDate":"2024-12-17T14:14:17.54","isLossPick":false,"isRestrictedAccess":false,"isArchived":false}]

  @Input() showModal: boolean = false;
  @Input() eventSet: EventSet | null = null;
  @Output() onConfirm: EventEmitter<{ eventSetId: number, eventIds: number[] | null }> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };
  public rowData: Event[] = [];
  public gridApi!: GridApi;
  public selectAll: boolean = false;

  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
  };

  constructor(
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    if (this.eventSet && this.eventSet.events) {
      console.log('event set events', JSON.stringify(this.eventSet.events));
      debugger;
      this.initializeColumnDefs();
      this.rowData = this.eventSet.events;
    }
  }

  initializeColumnDefs(): void {
    this.columnDefs = [
      {
        field: 'eventType.eventTypeName',
        headerName: 'Event Type',
      },
      {
        field: 'regionPeril.regionPerilName',
        headerName: 'Region Peril',
      },
      {
        field: 'eventNameShort',
        headerName: 'Event Name',
      },
      {
        field: 'eventID',
        headerName: 'Event ID',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
      },
      {
        field: 'createdBy', // Corrected from userName
        headerName: 'Created By',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
      },
      {
        field: 'createDate',
        headerName: 'Created Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        valueFormatter: (params: any) => {
          return params?.data?.createDate
            ? new Date(params.data.createDate).toLocaleDateString('en-GB')
            : '';
        },
      },
      {
        field: 'industryLossEstimate',
        headerName: 'Industry Loss Estimate',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellRenderer: (params: any) => {
          return params?.data?.industryLossEstimate != null
            ? params.data.industryLossEstimate.toString()
            : '';
        },
        valueFormatter: (params: any) => {
          return params?.value != null ? params.value.toString() : '';
        },
        valueParser: (params: any) => {
          const value = params.newValue;
          return isNaN(Number(value)) ? value : Number(value);
        },
      },
      {
        field: 'isRestrictedAccess', // Corrected from restricted
        headerName: 'Restricted',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['clear', 'apply'],
        } as ITextFilterParams,
        cellRenderer: (params: any) => {
          return params.value ? 'Yes' : 'No';
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: true,
      },
      {
        field: 'isArchived', // Corrected from archived
        headerName: 'Archived',
        filter: true,
        filterParams: {
          buttons: ['reset', 'apply'],
        } as ITextFilterParams,
        cellRenderer: (params: any) => (params.value ? 'Yes' : 'No'),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Yes', 'No'] },
        editable: true,
      },
    ];
  }
  

  dateFormatter(params: ValueFormatterParams): string {
    return params.value ? new Date(params.value).toLocaleDateString('en-GB') : '';
  }

  currencyFormatter(params: ValueFormatterParams): string {
    return params.value != null ? `$${params.value.toLocaleString()}` : '';
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.gridApi.selectAll();
    } else {
      this.gridApi.deselectAll();
    }
  }

  confirmDeletion(): void {
    if (!this.eventSet) {
      this.notification.error('Error', 'No Event Set selected for deletion.');
      return;
    }

    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedEventIds = selectedNodes.map(node => node.data.eventID);

    if (selectedEventIds.length === 0) {
      this.notification.warning('No Selection', 'Please select at least one event to delete.');
      return;
    }

    if (selectedEventIds.length === this.eventSet?.events?.length) {
      // User selected all events; treat as deleting entire event set
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: null });
    } else {
      // User selected specific events to delete
      this.onConfirm.emit({ eventSetId: this.eventSet.eventSetID as any, eventIds: selectedEventIds });
    }

    this.closeModal();
  }

  closeModal(): void {
    this.onCancel.emit();
  }
}
