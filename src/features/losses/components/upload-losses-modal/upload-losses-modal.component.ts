import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss']
})
export class UploadLossLoadModalComponent {
  @Input() showModal = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

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
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    this.uploadForm.patchValue({ file });
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
