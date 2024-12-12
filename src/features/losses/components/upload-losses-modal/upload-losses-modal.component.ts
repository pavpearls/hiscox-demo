import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LossFacade } from 'features/losses/store/losses.facade';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filterSuccess, isFailure, isInProgress, isSuccess } from 'ngx-remotedata';
import { combineLatest, map } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss']
})
export class UploadLossLoadModalComponent implements OnInit {
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

  vm$ = combineLatest([
    this.lossFacade.state.fileUpload.validateFile$,
    this.lossFacade.state.fileUpload.uploadFile$,
  ]).pipe(
    map(([validateFileState, uploadFileState]) => ({
      loading: [validateFileState, uploadFileState].some((state) =>
        isInProgress(state)
      ),
      error: [validateFileState, uploadFileState].some((state) =>
        isFailure(state)
      ),
      success: [validateFileState, uploadFileState].every((state) =>
        isSuccess(state)
      ),
    }))
  );

  constructor(private fb: FormBuilder, private lossFacade: LossFacade, private notification: NzNotificationService) {
    this.uploadForm = this.fb.group({
      friendlyName: ['', [Validators.required, Validators.maxLength(200)]],
      dataFormat: ['', Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.lossFacade.showLoadingSpinnerForApiResponses(
      this.lossFacade.state.fileUpload.uploadFile$, 
      this.lossFacade.state.fileUpload.validateFile$
    );
  }

  handleOk(): void {
  if (this.uploadForm.valid) {
    const { file, friendlyName, dataFormat, description } = this.uploadForm.value;

    const renamedFile = new File([file], friendlyName || file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    this.onOk.emit(this.uploadForm.value);

    const uploadPayload = {
      file: renamedFile,
      friendlyName,
      dataFormat,
      description,
    };

    this.lossFacade.actions.fileUpload.uploadFile(uploadPayload.file);

    this.showModal = false;

    this.uploadForm.reset();
    this.listOfData = [];
    this.notification.success(
      'Upload Started',
      `Uploading file: ${renamedFile.name}`
    );
  } else {
    this.uploadForm.markAllAsTouched();
    this.notification.error('Form Invalid', 'Please fill out all required fields.');
  }
}

  handleCancel(): void {
    this.onCancel.emit();
    this.showModal = false;
    this.uploadForm.reset();
    this.listOfData = [];
  }

  toggleSelectAll(): void {
    this.userDefinedFields.forEach(field => (field.selected = this.selectAll));
  }

  handleFileInput(event: any): void {
    const files = event.target.files;

    if (files.length > 1) {
      this.notification.error('Multiple Files Detected', 'Only one file can be uploaded at a time.');
      return;
    }

    const file = files[0];
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (fileType === 'xlsx') {
        this.uploadForm.patchValue({ file });
        // this.validateFile(file);
      } else {
        this.notification.error('Invalid File', 'Please upload a valid XLSX file.');
      }
    }
  }

  validateFile(file: File): void {
    this.isValidating = true;

    this.lossFacade.actions.fileUpload.validateFile(file);

    this.lossFacade.state.fileUpload.validateFile$
      .pipe(filterSuccess())
      .subscribe(
        () => {
          this.notification.success('Validation Successful', 'File validation passed. Parsing the file now...');
          this.parseFile(file);
          this.isValidating = false;
        },
        () => {
          this.notification.error('Validation Failed', 'File validation failed. Please check the file and try again.');
          this.isValidating = false;
        }
      );
  }

  parseFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = 'Loss Worksheet';
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
        this.listOfData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        this.notification.success('File Parsed', 'File parsed successfully! Check the preview tab.');
      } else {
        this.notification.error('Sheet Not Found', 'Loss Worksheet not found in the uploaded file.');
      }
    };
    reader.readAsBinaryString(file);
  }
}
