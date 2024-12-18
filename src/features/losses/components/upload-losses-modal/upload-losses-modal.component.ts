import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LossFacade } from 'features/losses/store/losses.facade';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import {
  filterFailure,
  filterSuccess,
  isFailure,
  isInProgress,
  isSuccess,
} from 'ngx-remotedata';
import {
  combineLatest,
  map,
  Observable,
  Observer,
  of,
  Subscription,
  take,
  takeWhile,
} from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss'],
})
export class UploadLossLoadModalComponent implements OnInit, OnDestroy {
  @Input() showModal = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  selectAll = false;
  userDefinedFields: { name: string; selected: boolean; type: string }[] = [];
  dataTypeOptions = ['String', 'Number', 'Boolean', 'Date'];
  dontUpload$ = of(false);
  fileList: NzUploadFile[] = [];

  isFileValid = false;
  listOfData: any[] = [];
  totalRows = 5000;
  isValidating = false;
  uploadForm: FormGroup;
  modalWidth: string | number = '50%';
  isComponentAlive = true;
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
    { value: 'otherFormat2', label: 'Other Format 2' },
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

  constructor(
    private fb: FormBuilder,
    private lossFacade: LossFacade,
    private notification: NzNotificationService
  ) {
    this.uploadForm = this.fb.group({
      friendlyName: ['', [Validators.required, Validators.maxLength(200)]],
      dataProducer: ['', Validators.required],
      dataFormat: ['', Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      file: [null, Validators.required],
    });
  }

  customRequest = (item: any): Subscription => {
    // Prevents upload by default in ng zorro component
    return of(null).pipe(take(1)).subscribe();
  };

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const fileType = file.name.split('.').pop()?.toLowerCase();

      const isXlsx = fileType === 'xlsx';
      if (!isXlsx) {
        this.notification.error(
          'Invalid File',
          'Please upload a valid XLSX file.'
        );
        observer.complete();
        return;
      }
      const isLt100M = file.size! / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.notification.error(
          'Invalid File',
          'File must smaller than 100MB!'
        );
        observer.complete();
        return;
      }
      // Prevent upload by default
      this.fileList = [file];
      this.uploadForm.patchValue({ file });
      observer.next(false);
      observer.complete();
    });

  ngOnInit(): void {
    this.lossFacade.showLoadingSpinnerForApiResponses(
      this.lossFacade.state.fileUpload.uploadFile$,
      this.lossFacade.state.fileUpload.validateFile$
    );

    this.handleFileUploadResponse();
  }

  handleFileUploadResponse(): void {
    // TODO will be refactored into the effect
    this.lossFacade.state.fileUpload.uploadFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterFailure())
      .subscribe(() => {
        this.notification.error(
          'Upload Failed',
          'Failed to upload the file. Please check the file and try again.'
        );
        this.showModal = false;
        this.uploadForm.reset();
        this.listOfData = [];
      });

    this.lossFacade.state.fileUpload.uploadFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe(() => {
        this.notification.success(
          'Upload Successfull',
          'File upload complete.'
        );
        this.showModal = false;
        this.uploadForm.reset();
        this.listOfData = [];
      });
  }

  handleOk(): void {
    if (this.uploadForm.valid && this.isFileValid) {
      const { file, friendlyName, dataFormat, dataProducer, description } =
        this.uploadForm.value;

      const renamedFile = new File([file], friendlyName || file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      this.onOk.emit(this.uploadForm.value);

      const uploadPayload = {
        file: renamedFile,
        friendlyName,
        dataFormat,
        dataProducer,
        description,
      };

      this.lossFacade.actions.fileUpload.uploadFile(uploadPayload.file);

      this.notification.success(
        'Upload Started',
        `Uploading file: ${renamedFile.name}`
      );
    } else {
      this.uploadForm.markAllAsTouched();
      this.notification.error(
        'Form Invalid',
        'Please fill out all required fields and provide a valid file for upload.'
      );
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
    this.showModal = false;
    this.uploadForm.reset();
    this.listOfData = [];
  }

  toggleSelectAll(): void {
    this.userDefinedFields.forEach(
      (field) => (field.selected = this.selectAll)
    );
  }

  handleFileInput(event: NzUploadChangeParam): void {
    if (event.file.status !== 'uploading') {
      console.log(event.file, event.fileList);
    }

    if (event.file.status === 'done') {
      this.notification.success(
        'Success',
        `${event.file.name} file uploaded successfully`
      );

      const file: NzUploadFile = event.file;

      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (fileType === 'xlsx') {
        this.uploadForm.patchValue({ file });
        // this.validateFile(file);
      } else {
        this.notification.error(
          'Invalid File',
          'Please upload a valid XLSX file.'
        );
      }
    } else if (event.file.status === 'error') {
      this.notification.error('File Upload', `${event.file.name} failed.`);
    }
  }

  validateFile(): void {
    if (!this.uploadForm.valid) {
      this.uploadForm.markAllAsTouched();
      this.notification.error(
        'Form Invalid',
        'Please fill out all required fields.'
      );
      return;
    }
    this.isValidating = true;

    const { file } = this.uploadForm.value;

    this.lossFacade.actions.fileUpload.validateFile(file);

    this.lossFacade.state.fileUpload.validateFile$
      .pipe(filterSuccess())
      .subscribe(
        (data) => {
         const response = data.value;
         this.fileValidationResults = [
          { check: 'Xlsx File Type', result: response.fileTypeValid ? 'true': 'false' },
          { check: 'Loss Worksheet Found', result: response.lossWorksheetFound ? 'true': 'false' },
          { check: 'All Loss Fields Found', result: response.mandatoryFieldsValid ? 'true': 'false' },
          { check: 'All Events Found', result: response.allEventsValid ? 'true': 'false' },
          { check: 'All Loss Classes Found', result: response.allLossClassesValid ? 'true': 'false' },
          { check: 'VALID FILE?', result: response.isValid ? 'true': 'false' },
        ];
        this.isFileValid = response.isValid;
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

      const sheetName = 'Gross Loss';
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
        this.listOfData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[];
        this.notification.success(
          'File Parsed',
          'File parsed successfully! Check the preview tab.'
        );
      } else {
        this.notification.error(
          'Sheet Not Found',
          'Loss Worksheet not found in the uploaded file.'
        );
      }
    };
    reader.readAsBinaryString(file);
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}
