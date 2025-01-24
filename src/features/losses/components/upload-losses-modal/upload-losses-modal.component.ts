import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsFacade } from '@events//store/events.facade';
import { DataProducer } from '@shared/api-services/dataProducer';
import { UploadFileRequest } from '@shared/api-services/uploadFileRequest';
import { LossFacade } from 'features/losses/store/losses.facade';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import {
  filterFailure,
  filterSuccess,
  isFailure,
  isInProgress,
  isSuccess,
  RemoteData,
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
import { NdsApiServiceWrapper } from 'shared/api-services/nds-api/custom/nds-api-service-wrapper';
import * as XLSX from 'xlsx';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss'],
})
export class UploadLossLoadModalComponent implements OnInit, OnDestroy {
  @Input() showModal = true;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  dataProducerList$: Observable<RemoteData<DataProducer[], HttpErrorResponse>> =
    this.eventsFacade.state.events.dataProducerList$;
  eventSetList$: Observable<RemoteData<any[], HttpErrorResponse>> =
    this.eventsFacade.state.eventSets.getEventSetList$;

  selectAll = false;
  userDefinedFields: { name: string; selected: boolean; type: string }[] = [];
  dataTypeOptions = ['String', 'Number', 'Boolean', 'Date'];

  fileList: NzUploadFile[] = [];

  selectedTabIndex = 0;

  isFileValid = false;

  tableHeaders: any[] = [];
  tableRows: any[] = [];

  displayData: any[] = [];

  loading = false;
  isValidating = false;

  total = 0;
  pageIndex = 1;
  pageSize = 10;

  validationErrors: any = null;

  isComponentAlive = true;

  fileValidationResults = [
    { check: 'Xlsx File Type', result: 'false' },
    { check: 'Loss Worksheet Found', result: 'false' },
    { check: 'All Loss Fields Found', result: 'false' },
    { check: 'All Events Found', result: 'false' },
    { check: 'All Loss Classes Found', result: 'false' },
    { check: 'VALID FILE?', result: 'false' },
  ];

  dataProducerList: any[] = [];
  eventSetData: any[] = [];

  dataFormatOptions = [
    { value: 'hiscox2014', label: 'Hiscox RDS 2014' },
    { value: 'otherFormat1', label: 'Other Format 1' },
    { value: 'otherFormat2', label: 'Other Format 2' },
  ];

  uploadForm: FormGroup;

  modalWidth: string | number = '80%';

  vm$ = combineLatest([
    this.lossFacade.state.fileUpload.validateFile$,
    this.lossFacade.state.fileUpload.uploadFile$,
    this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$,
  ]).pipe(
    map(
      ([
        validateFileState,
        uploadFileState,
        apiLossLoadUploadFilePostState,
      ]) => {
        const loading = [
          validateFileState,
          uploadFileState,
          apiLossLoadUploadFilePostState,
        ].some((state) => isInProgress(state));

        const error = [
          validateFileState,
          uploadFileState,
          apiLossLoadUploadFilePostState,
        ].some((state) => isFailure(state));

        const success = [
          validateFileState,
          uploadFileState,
          apiLossLoadUploadFilePostState,
        ].every((state) => isSuccess(state));

        return { loading, error, success };
      }
    )
  );

  constructor(
    private fb: FormBuilder,
    private lossFacade: LossFacade,
    private eventsFacade: EventsFacade,
    private notification: NzNotificationService,
    private api: NdsApiServiceWrapper
  ) {
    this.uploadForm = this.fb.group({
      friendlyName: ['', Validators.maxLength(200)],
      dataProducer: ['', Validators.required],
      eventSet: ['', Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.lossFacade.showLoadingSpinnerForApiResponses(
      this.lossFacade.state.fileUpload.uploadFile$,
      this.lossFacade.state.fileUpload.validateFile$,
      this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$,
      this.eventsFacade.state.events.dataProducerList$,
      this.eventsFacade.state.eventSets.getEventSetList$
    );

    this.eventsFacade.actions.events.loadDataProducerList();
    this.eventsFacade.actions.eventSets.getEventSetList();

    this.handleFileUploadResponse();
    this.handleValidateFileResponse();
    this.handleGrossLossResponse();

    this.dataProducerList$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe((response) => {
        this.dataProducerList = response.value;
      });

    this.eventSetList$
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe((data: any) => {
        if (isSuccess(data)) {
          this.eventSetData = data.value as any;
        }
      });

    this.vm$
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe((status) => {
        if (status.success) {
          this.notification.success(
            'Upload Successful',
            'File parsed and data saved successfully'
          );
          this.selectedTabIndex = 0;
          this.handleCancel();
        }
      });
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.resetModal();
  }

 
  private resetModal(): void {
    this.uploadForm.reset();
    this.isValidating = false;
    this.isFileValid = false;
    this.validationErrors = null;

    this.fileValidationResults = [
      { check: 'Xlsx File Type', result: 'false' },
      { check: 'Loss Worksheet Found', result: 'false' },
      { check: 'All Loss Fields Found', result: 'false' },
      { check: 'All Events Found', result: 'false' },
      { check: 'All Loss Classes Found', result: 'false' },
      { check: 'VALID FILE?', result: 'false' },
    ];

    this.tableHeaders = [];
    this.tableRows = [];
    this.displayData = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 0;
    this.fileList = [];
  }

  customRequest = (item: any): Subscription => {
    // We do nothing here: user must explicitly validate & upload
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
          'File must be smaller than 100MB!'
        );
        observer.complete();
        return;
      }

      this.fileList = [file];
      this.uploadForm.patchValue({ file });
      // Prevent auto-upload by returning `false`
      observer.next(false);
      observer.complete();
    });

  handleFileInput(event: NzUploadChangeParam): void {
    if (event.file.status === 'done') {
      this.notification.success(
        'Success',
        `${event.file.name} file uploaded successfully`
      );
    } else if (event.file.status === 'error') {
      this.notification.error('File Upload', `${event.file.name} failed.`);
    }
  }

  validateFile(): void {
    if (!this.uploadForm.valid) {
      this.uploadForm.markAllAsTouched();
      if (!this.uploadForm.controls['file'].valid) {
        this.notification.error(
          'Form Invalid',
          'Please select a valid XLSX file to upload.'
        );
      } else {
        this.notification.error(
          'Form Invalid',
          'Please fill out all required fields.'
        );
      }
      return;
    }

    this.isValidating = true;
    const { file } = this.uploadForm.value;
    this.lossFacade.actions.fileUpload.validateFile(file);
  }

  handleOk(): void {
    if (this.uploadForm.valid && this.isFileValid) {
      const { file, friendlyName, eventSet, dataProducer, description } =
        this.uploadForm.value;

      const renamedFile = new File([file], friendlyName || file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      this.onOk.emit(this.uploadForm.value);

      const uploadPayload = {
        file: renamedFile,
        friendlyName,
        eventSet,
        dataProducer,
        description,
      };

      const uploadFileRequestPayload: UploadFileRequest = {
        lossLoadRequest: {
          eventSetID: eventSet,
          dataSourceTypeID: 3, // Hardcoded for now 
          dataProducerID: dataProducer,
          dataSourceName: friendlyName + new Date().toLocaleDateString(),
          lossLoadName: friendlyName + new Date().toLocaleDateString(),
          lossLoadDescription: description,
          loadDate: new Date(),
          isArchived: false,
          isValid: true,
        },
      };

      this.lossFacade.actions.fileUpload.uploadFile(uploadPayload.file);
      this.api.lossLoadService
        .uploadFileRequest(uploadFileRequestPayload)
        .pipe(take(1))
        .subscribe((lossLoadID: any) => {
          this.lossFacade.actions.lossSets.apiLossLoadUploadFilePost(
            lossLoadID?.newId,
            uploadPayload.file
          );

          this.notification.success(
            'Upload Started',
            `Uploading file: ${renamedFile.name}`
          );
        });
    } else {
      this.uploadForm.markAllAsTouched();
      this.notification.error(
        'Form Invalid',
        'Please fill out all required fields and/or validate the file.'
      );
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
    this.resetModal();
  }

  private handleValidateFileResponse(): void {
    this.lossFacade.state.fileUpload.validateFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe((response) => {
        const {
          allEventsValid,
          errors,
          allLossClassesValid,
          fileTypeValid,
          isValid,
          lossWorksheetFound,
          mandatoryFieldsValid,
          rowValidations,
        } = response.value;

        this.fileValidationResults = [
          {
            check: 'Xlsx File Type',
            result: fileTypeValid ? 'true' : 'false',
          },
          {
            check: 'Loss Worksheet Found',
            result: lossWorksheetFound ? 'true' : 'false',
          },
          {
            check: 'All Loss Fields Found',
            result: mandatoryFieldsValid ? 'true' : 'false',
          },
          {
            check: 'All Events Found',
            result: allEventsValid ? 'true' : 'false',
          },
          {
            check: 'All Loss Classes Found',
            result: allLossClassesValid ? 'true' : 'false',
          },
          { check: 'VALID FILE?', result: isValid ? 'true' : 'false' },
        ];

        this.isFileValid = isValid;
        this.isValidating = false;

        this.validationErrors = rowValidations || null;

        if (isValid) {
          const file = this.uploadForm.value.file;
          this.parseFile(file);
        }
      });

    this.lossFacade.state.fileUpload.validateFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterFailure())
      .subscribe(() => {
        this.isValidating = false;
        this.notification.error(
          'File Validation Failed',
          'Failed to validate the file. Please check the file and try again.'
        );
      });
  }

  private handleGrossLossResponse() {
    this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe(() => {
        this.notification.success(
          'Upload Successful',
          'File parsed successfully and data saved to GrossLoss table.'
        );
        this.handleCancel();
        this.selectedTabIndex = 0;
      });
  }

  private handleFileUploadResponse(): void {
    this.lossFacade.state.fileUpload.uploadFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe(() => {
        this.notification.success('Upload Successful', 'File upload complete.');
      });
  }

  private parseFile(file: File): void {
    this.loading = true;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = 'Gross Loss';
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[];

        if (rawData.length > 0) {
          this.tableHeaders = rawData[0];
          this.tableRows = rawData.slice(1);
          this.total = this.tableRows.length;
          this.refreshDisplayData();
          this.notification.success(
            'File Parsed',
            'File parsed successfully! Check the Preview tab.'
          );
          this.selectedTabIndex = 1;
        } else {
          this.notification.warning('No Rows Found', 'The worksheet is empty.');
        }
      } else {
        this.notification.error(
          'Sheet Not Found',
          'Loss Worksheet not found in the uploaded file.'
        );
      }

      this.loading = false;
    };
    reader.readAsBinaryString(file);
  }

  refreshDisplayData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayData = this.tableRows.slice(startIndex, endIndex);
  }

  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.refreshDisplayData();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.pageIndex = 1; 
    this.refreshDisplayData();
  }

  toggleSelectAll(): void {
    this.userDefinedFields.forEach(
      (field) => (field.selected = this.selectAll)
    );
  }
}
