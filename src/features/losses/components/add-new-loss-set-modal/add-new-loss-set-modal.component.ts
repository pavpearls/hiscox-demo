import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, FirstDataRenderedEvent, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-add-new-loss-set-modal',
  templateUrl: './add-new-loss-set-modal.component.html',
  styleUrls: ['./add-new-loss-set-modal.component.scss']
})
export class AddNewLossSetModalComponent {
  @Input() isVisible = false;
  @Input() selectedOption: 'Loss Set' | 'Loss Set Version' | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  private gridColumnApi: any;
  form: FormGroup;

  columnDefs: ColDef[] = [
    { headerName: 'Load ID', field: 'loadId', checkboxSelection: true, width: 100 },
    { headerName: 'Loss Load Name', field: 'lossLoadName', flex: 1 },
    { headerName: 'Event Set', field: 'eventSet', width: 120 },
    { headerName: 'Event Set Type', field: 'eventSetType', width: 140 },
    { headerName: 'Data Source', field: 'dataSource', width: 130 },
    { headerName: 'Loss Grain', field: 'lossGrain', width: 120 },
    { headerName: 'Upload User', field: 'uploadUser', width: 130 },
    { headerName: 'Upload Date', field: 'uploadDate', width: 120 },
    { headerName: 'Loss Load Description', field: 'lossLoadDescription', flex: 2 },
    { headerName: 'Valid', field: 'valid', width: 80 }
  ];

  rowData = [
    {
      loadId: 724,
      lossLoadName: 'POLICY_LIST_Beryl_2024_11_Berly Reported Losses - US - Q4',
      eventSet: 'Beryl',
      eventSetType: 'Post Event',
      dataSource: 'Claims MI Database',
      lossGrain: 'Loss Class',
      uploadUser: 'Tom Clements',
      uploadDate: '2024-Nov',
      lossLoadDescription: 'Beryl Reported Losses - US - Q4',
      valid: 'Yes'
    },
    {
      loadId: 725,
      lossLoadName: 'POLICY_LIST_Beryl_2024_11_Berly Reported Losses - UK - Q4',
      eventSet: 'Beryl',
      eventSetType: 'Post Event',
      dataSource: 'Claims MI Database',
      lossGrain: 'Loss Class',
      uploadUser: 'Tom Clements',
      uploadDate: '2024-Nov',
      lossLoadDescription: 'Beryl Reported Losses - UK - Q4',
      valid: 'Yes'
    },
  ];

  eventSets = ['Beryl', 'Atlantic Storms', 'Pacific Typhoons'];
  years = [2024, 2023, 2022];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days = Array.from({ length: 31 }, (_, i) => i + 1);
  lossSetNames: string[] = [
    'Berly Reported Losses for Q4',
    'Policy Loss Set - European Segment',
    'Policy Loss Set - US Segment'
  ];
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lossSetName: [''],
      eventSet: [null],
      year: [null],
      month: [null],
      day: [null],
      lock: [false]
    });
  }

  handleOk(): void {
    this.onSave.emit(this.form.value);
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  onAttachLoad(): void {
    console.log('Attach load(s) clicked');
  }

  onDetachLoad(): void {
    console.log('Detach load(s) clicked');
  }

  onVersionSuggestion(): void {}

  onGridReady(params: GridReadyEvent) {
    this.gridColumnApi = params.api;
    this.gridColumnApi.autoSizeAllColumns();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.autoSizeAllColumns();
  }
}
