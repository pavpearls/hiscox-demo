import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss']
})
export class UploadLossLoadModalComponent {
  @Input() showModal = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  selectAll = false;
  userDefinedFields: { name: string; selected: boolean; type: string }[] = [];
  dataTypeOptions = ['String', 'Number', 'Boolean', 'Date'];

  listOfData: any[] = [];
  totalRows = 5000;
  isValidating = false; 
  uploadForm: FormGroup;
  modalWidth: string | number = '50%';
  fileValidationResults = [
  { check: 'Xlsx File Type', result: 'false' },
  { check: 'Loss Worksheet Found', result: 'false' },
  { check: 'All Loss Fields Found', result: 'false' },
  { check: 'All Events Found', result: 'false' },
  { check: 'All Loss Classes Found', result: 'false' },
  { check: 'VALID FILE?', result: 'false' },
];


  dataFormatOptions = [
    { value: 'hiscox2014', label: 'Hiscox RDS 2014' },
    { value: 'otherFormat1', label: 'Other Format 1' },
    { value: 'otherFormat2', label: 'Other Format 2' }
  ];

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
        friendlyName: ['', [Validators.required, Validators.maxLength(200)]],
        dataFormat: ['', Validators.required],
        description: ['', [Validators.maxLength(1000)]],
        file: [null, Validators.required]
      });
      this.generateMockData();
      this.generateUserDefinedFields();
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({ file });
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (fileType === 'xlsx' || fileType === 'csv') {
        this.readFile(file);
      } else {
        alert('Invalid file type. Please upload an XLSX or CSV file.');
      }
    }
  }

  handleOk(): void {
    if (this.uploadForm.valid) {
      this.onOk.emit(this.uploadForm.value);
      this.showModal = false;
    } else {
      this.uploadForm.markAllAsTouched();
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
    this.showModal = false;
    this.uploadForm.reset();
  }

  generateMockData(): void {
    const eventNames = [
      'Hurricane Milton - Low $5bn',
      'Hurricane Milton - Medium $5bn',
      'Hurricane Milton - High $5bn',
      'Hurricane Milton - Low $10bn',
      'Hurricane Milton - Medium $10bn',
      'Hurricane Milton - High $10bn',
    ];
    const lossClassNames = ['33 LM Commercial Lines'];
    const currencies = ['USD'];
    const years = [2020, 2021, 2022];
    const yearLossApportionment = 0.33333;

    for (let i = 1; i <= this.totalRows; i++) {
      this.listOfData.push({
        rowNum: i,
        eventName: eventNames[i % eventNames.length],
        lossClassName: lossClassNames[0],
        yoa: years[i % years.length],
        yearLossApportionment: yearLossApportionment,
        currency: currencies[0],
        grossLoss: (Math.random() * 50000000).toFixed(2),
        reinstatementRoL: 0,
        aggregate: (Math.random() * 100000000).toFixed(2),
      });
    }
  }

  toggleSelectAll(): void {
    this.userDefinedFields.forEach(field => (field.selected = this.selectAll));
  }

  onValidationComplete(): void {
    this.generateUserDefinedFields();
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      this.validateWorkbook(workbook);
    };
    reader.readAsBinaryString(file);
  }

  validateWorkbook(workbook: XLSX.WorkBook): void {
    const requiredSheets = ['Loss Worksheet'];
    const requiredFields = ['Risk Carrier', 'Sales Unit', 'Line of Business'];

    let validationResults = [...this.fileValidationResults];
    const sheetNames = workbook.SheetNames;

    // Validate Sheets
    validationResults[1].result = requiredSheets.every(sheet =>
      sheetNames.includes(sheet)
    ) ? 'true' : 'false';

    // Validate Fields in the First Sheet
    if (sheetNames.length > 0) {
      const firstSheet = workbook.Sheets[sheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[];
      const headers = data[0] || [];

      validationResults[2].result = requiredFields.every(field =>
        headers.includes(field)
      ) ? 'true' : 'false';
    }

    // Validate Overall File
    validationResults[5].result = validationResults.every(res => res.result === 'true') ? 'true' : 'false';
    this.fileValidationResults = validationResults;

    if (validationResults[5].result === 'true') {
      console.log('File validated successfully!');
    } else {
      console.log('File validation failed. Please check the file format.');
    }
  }
  
  generateUserDefinedFields(): void {
    this.userDefinedFields = [
      { name: 'Risk Carrier', selected: false, type: 'String' },
      { name: 'Sales Unit', selected: false, type: 'String' },
      { name: 'Line of Business', selected: false, type: 'String' },
      { name: 'Assured', selected: false, type: 'String' },
      { name: 'Terms', selected: false, type: 'String' },
      { name: 'Signed Line', selected: false, type: 'String' },
      { name: 'Program ID', selected: false, type: 'String' },
      { name: 'Layer ID', selected: false, type: 'String' },
      { name: 'UW Ref', selected: false, type: 'String' },
      { name: 'Claims Ref', selected: false, type: 'String' }
    ];
  }

  validateFile(): void {
    this.isValidating = true;
    setTimeout(() => {
      this.isValidating = false;
      this.fileValidationResults = this.fileValidationResults.map(result => ({
        ...result,
        result: 'true',
      }));
    }, 2000);
  }
}
