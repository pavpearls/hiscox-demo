import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  filter,
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
import { EventsFacade } from '@events//store/events.facade';
import { DataProducer } from '@shared/api-services/dataProducer';
import { LossLoadService } from 'shared/api-services/nds-api/generated';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadLossLoadModalComponent implements OnInit, OnDestroy {
  @Input() showModal = true;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  dataProducerList$: Observable<
    RemoteData<DataProducer[], HttpErrorResponse>
  > = this.eventsFacade.state.events.dataProducerList$;
  eventSetList$: Observable<
    RemoteData<any[], HttpErrorResponse>
  > = this.eventsFacade.state.eventSets.getEventSetList$;

  /** For UDF or future use */
  selectAll = false;
  userDefinedFields: { name: string; selected: boolean; type: string }[] = [];
  dataTypeOptions = ['String', 'Number', 'Boolean', 'Date'];

  /** The file list for the upload control. */
  fileList: NzUploadFile[] = [];

  /** Tabs: 0 -> Upload, 1 -> Preview */
  selectedTabIndex = 0;

  /** Flag to indicate the file is valid after server-side validation. */
  isFileValid = false;

  /** 
   * Holds all rows from the XLSX file 
   * `tableHeaders` -> dataSet[0], 
   * `tableRows` -> dataSet.slice(1)
   */
  tableHeaders: any[] = [];
  tableRows: any[] = [];

  /** Subset of rows for display */
  displayData: any[] = [];

  /** For table loading/spinning states */
  loading = false;
  isValidating = false;

  /** For table pagination */
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  /** Errors returned from the validation step (to show as JSON) */
  validationErrors: any = null;

  /** 
   * Keeps track of component’s alive status for unsubscribing properly 
   */
  isComponentAlive = true;

  /** The results displayed in the File Validation table. */
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

  /** Make the modal wider */
  modalWidth: string | number = '80%';

  /** A combined stream to check loading/success/failure states. */
  vm$ = combineLatest([
    this.lossFacade.state.fileUpload.validateFile$,
    this.lossFacade.state.fileUpload.uploadFile$,
    this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$,
  ]).pipe(
    map(([validateFileState, uploadFileState, apiLossLoadUploadFilePostState]) => {
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
    })
  );

  constructor(
    private fb: FormBuilder,
    private lossFacade: LossFacade,
    private eventsFacade: EventsFacade,
    private notification: NzNotificationService,
    private lossLoadApiService: LossLoadService,
    private api: NdsApiServiceWrapper
  ) {
    this.uploadForm = this.fb.group({
      friendlyName: ['', [Validators.required, Validators.maxLength(200)]],
      dataProducer: ['', Validators.required],
      eventSet: ['', Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Start any loading spinners
    this.lossFacade.showLoadingSpinnerForApiResponses(
      this.lossFacade.state.fileUpload.uploadFile$,
      this.lossFacade.state.fileUpload.validateFile$,
      this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$,
      this.eventsFacade.state.events.dataProducerList$,
      this.eventsFacade.state.eventSets.getEventSetList$
    );

    // Trigger data loading for dropdowns
    this.eventsFacade.actions.events.loadDataProducerList();
    this.eventsFacade.actions.eventSets.getEventSetList();

    // Handle the relevant streams
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

    this.vm$.pipe(takeWhile(() => this.isComponentAlive)).subscribe((status) => {
      // If *all* steps (validate, upload, post) are success, then show success.
      if (status.success) {
        this.notification.success(
          'Upload Successful',
          'File parsed and data saved successfully'
        );
        // If you want the modal to close automatically on success, do it here:
        this.showModal = false;
        // This ensures a clean state if the modal is opened again:
        this.resetModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    // Clean up state
    this.resetModal();
  }

  /**
   * Clean up all form data and arrays
   */
  private resetModal(): void {
    this.uploadForm.reset();
    this.isValidating = false;
    this.isFileValid = false;
    this.validationErrors = null;
    // Reset the file validation results
    this.fileValidationResults = [
      { check: 'Xlsx File Type', result: 'false' },
      { check: 'Loss Worksheet Found', result: 'false' },
      { check: 'All Loss Fields Found', result: 'false' },
      { check: 'All Events Found', result: 'false' },
      { check: 'All Loss Classes Found', result: 'false' },
      { check: 'VALID FILE?', result: 'false' },
    ];
    // Clear table data
    this.tableHeaders = [];
    this.tableRows = [];
    this.displayData = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 0;
    this.fileList = [];
  }

  /* ---------------------------
   * FILE UPLOAD HOOKS
   * ------------------------- */

  /**
   * Override the default Ng Zorro request to prevent auto-upload
   */
  customRequest = (item: any): Subscription => {
    // We do nothing here: user must explicitly validate & upload
    return of(null).pipe(take(1)).subscribe();
  };

  /**
   * Validate file before letting Ng Zorro upload it
   */
  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      const isXlsx = fileType === 'xlsx';
      if (!isXlsx) {
        this.notification.error('Invalid File', 'Please upload a valid XLSX file.');
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

      // If everything is fine, set the file to our form control
      this.fileList = [file];
      this.uploadForm.patchValue({ file });
      // Prevent auto-upload by returning `false`
      observer.next(false);
      observer.complete();
    });

  /**
   * Invoked when file(s) is chosen in the upload widget
   */
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

  /**
   * Validate file by calling the facade
   */
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

  /**
   * Once user clicks on OK in the modal
   */
  handleOk(): void {
    if (this.uploadForm.valid && this.isFileValid) {
      const { file, friendlyName, eventSet, dataProducer, description } =
        this.uploadForm.value;

      // rename file if needed
      const renamedFile = new File([file], friendlyName || file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      this.onOk.emit(this.uploadForm.value);

      // create payload
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
          dataSourceTypeID: 3, // example
          dataProducerID: dataProducer,
          dataSourceName: friendlyName + new Date().toLocaleDateString(),
          lossLoadName: friendlyName + new Date().toLocaleDateString(),
          lossLoadDescription: description,
          loadDate: new Date(),
          isArchived: false,
          isValid: true,
        },
      };

      // Perform the actions in the correct order:
      this.lossFacade.actions.fileUpload.uploadFile(uploadPayload.file);
      this.api
        .lossLoadService.uploadFileRequest(uploadFileRequestPayload)
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
    // If you want to keep the data in form after close, remove the reset
    this.onCancel.emit();
    // Typically you might reset the modal after user cancels:
    this.resetModal();
  }

  /* ---------------------------
   * RESPONSE HANDLERS
   * ------------------------- */

  /**
   * Handle success/fail for validateFile$
   */
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

        // Store the results in the table
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

        // Store any validation errors from the server so we can display as JSON
        this.validationErrors = errors || rowValidations || null;

        if (isValid) {
          const file = this.uploadForm.value.file;
          this.parseFile(file);
          // Jump to preview tab
          this.selectedTabIndex = 1;
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

  /**
   * Handle success for grossLoss table
   */
  private handleGrossLossResponse() {
    this.lossFacade.state.lossSets.apiLossLoadUploadFilePost$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe(() => {
        this.notification.success(
          'Upload Successful',
          'File parsed successfully and data saved to GrossLoss table.'
        );
        // If you want to close the modal automatically, do it here:
        // this.showModal = false;
        // this.resetModal();
      });
  }

  /**
   * Handle success for fileUpload$
   */
  private handleFileUploadResponse(): void {
    this.lossFacade.state.fileUpload.uploadFile$
      .pipe(takeWhile(() => this.isComponentAlive))
      .pipe(filterSuccess())
      .subscribe(() => {
        this.notification.success('Upload Successful', 'File upload complete.');
      });
  }

  /* ---------------------------
   * XLSX PARSING
   * ------------------------- */

  /**
   * Parse the file on the client side so we can show a preview
   */
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
          // First row is assumed to be the header
          this.tableHeaders = rawData[0];
          // The rest are data rows
          this.tableRows = rawData.slice(1);
          this.total = this.tableRows.length;
          this.refreshDisplayData();
          this.notification.success(
            'File Parsed',
            'File parsed successfully! Check the Preview tab.'
          );
        } else {
          this.notification.warning(
            'No Rows Found',
            'The worksheet is empty.'
          );
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

  /**
   * Update the displayData based on pageIndex, pageSize.
   */
  refreshDisplayData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayData = this.tableRows.slice(startIndex, endIndex);
  }

  /* ---------------------------
   * PAGINATION HANDLERS
   * ------------------------- */

  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.refreshDisplayData();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.pageIndex = 1; // reset to first page
    this.refreshDisplayData();
  }

  /* Example to toggle all user-defined fields */
  toggleSelectAll(): void {
    this.userDefinedFields.forEach((field) => (field.selected = this.selectAll));
  }
}
