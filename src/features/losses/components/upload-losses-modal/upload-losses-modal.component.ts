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
import { EventsFacade } from '@events//store/events.facade';
import { DataProducer } from '@shared/api-services/dataProducer';
import { LossLoadService } from 'shared/api-services/nds-api/generated';

@Component({
  selector: 'upload-loss-load-modal',
  templateUrl: './upload-losses-modal.component.html',
  styleUrls: ['./upload-losses-modal.component.scss'],
})
export class UploadLossLoadModalComponent implements OnInit, OnDestroy {
  @Input() showModal = true;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  dataProducerList$: Observable<RemoteData<DataProducer[], HttpErrorResponse>> = this.eventsFacade.state.events.dataProducerList$;
  eventSetList$: Observable<RemoteData<any[], HttpErrorResponse>> = this.eventsFacade.state.eventSets.getEventSetList$;

  selectAll = false;
  userDefinedFields: { name: string; selected: boolean; type: string }[] = [];
  dataTypeOptions = ['String', 'Number', 'Boolean', 'Date'];
  dontUpload$ = of(false);
  fileList: NzUploadFile[] = [];
  selectedTabIndex = 0
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
  dataProducerList: any[];
  eventSetData: any[] = [];
  dataFormatOptions = [
    { value: 'hiscox2014', label: 'Hiscox RDS 2014' },
    { value: 'otherFormat1', label: 'Other Format 1' },
    { value: 'otherFormat2', label: 'Other Format 2' },
  ];

  vm$ = combineLatest([
    this.lossFacade.state.fileUpload.validateFile$,
    this.lossFacade.state.fileUpload.uploadFile$
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
    private eventsFacade: EventsFacade,
    private notification: NzNotificationService,
    private lossLoadApiService: LossLoadService,
    private api: NdsApiServiceWrapper,

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
      this.lossFacade.state.fileUpload.validateFile$,
      this.eventsFacade.state.events.dataProducerList$,
      this.eventsFacade.state.eventSets.getEventSetList$
    );

    this.eventsFacade.actions.events.loadDataProducerList();
    this.eventsFacade.actions.eventSets.getEventSetList();
    
    this.handleFileUploadResponse();
    this.handleValidateFileResponse();

    this.dataProducerList$.pipe(takeWhile(() => this.isComponentAlive))
    .pipe(filterSuccess())
    .subscribe((response) => { 
      this.dataProducerList = response.value
    });

    
    this.eventSetList$.subscribe((data: any) => {
      this.eventSetData = data.value;
    });
  }

  handleValidateFileResponse(): void {
    this.lossFacade.state.fileUpload.validateFile$
    .pipe(takeWhile(() => this.isComponentAlive))
    .pipe(filterSuccess())
    .subscribe((response) => {
      const {allEventsValid, errors, allLossClassesValid, fileTypeValid, isValid, lossWorksheetFound, mandatoryFieldsValid, rowValidations} = response.value;
  
      this.fileValidationResults = [
        { check: 'Xlsx File Type', result: fileTypeValid ? 'true' : 'false' },
        { check: 'Loss Worksheet Found', result: lossWorksheetFound ? 'true' : 'false' },
        { check: 'All Loss Fields Found', result: mandatoryFieldsValid ? 'true' : 'false' },
        { check: 'All Events Found', result: allEventsValid ? 'true' : 'false' },
        { check: 'All Loss Classes Found', result: allLossClassesValid ? 'true' : 'false' },
        { check: 'VALID FILE?', result: isValid ? 'true' : 'false' },
      ];

      this.isFileValid = isValid;
      this.isValidating = false;

      if (isValid) {

      }

      if (!isValid) {
        const file = this.uploadForm.value.file;
        this.parseFile(file);
        this.selectedTabIndex = 1;
      }
    });

    this.lossFacade.state.fileUpload.validateFile$
    .pipe(takeWhile(() => this.isComponentAlive))
    .pipe(filterFailure())
    .subscribe(() => {
      this.notification.error(
        'File Validation Failed',
        'Failed to validate the file. Please check the file and try again.'
      );
      this.showModal = false;
      this.uploadForm.reset();
      this.listOfData = [];
      this.isValidating = false;

      this.fileValidationResults = [
        { check: 'Xlsx File Type', result: 'false' },
        { check: 'Loss Worksheet Found', result: 'false' },
        { check: 'All Loss Fields Found', result: 'false' },
        { check: 'All Events Found', result: 'false' },
        { check: 'All Loss Classes Found', result: 'false' },
        { check: 'VALID FILE?', result: 'false' },
      ];
    });
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
    // ignore file valid for now && this.isFileValid
    if (this.uploadForm.valid) {
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

      const uploadFileRequestPayload: UploadFileRequest = {
        lossLoadRequest: {
          eventSetID: 15,
          dataSourceTypeID: 1,
          dataProducerID: 1,
          dataSourceName: 'test_data_source_2',
          lossLoadName: friendlyName + new Date().toLocaleDateString(),
          lossLoadDescription: description,
          loadDate: new Date(),
          isArchived: false,
          isValid: true,
        }
      }

      this.lossFacade.actions.fileUpload.uploadFile(uploadPayload.file);
      this.api.lossLoadService.uploadFileRequest(uploadFileRequestPayload).pipe(take(1)).subscribe((lossLoadID: any) => {
      
        this.lossFacade.actions.lossSets.apiLossLoadUploadFilePost((lossLoadID?.newId), uploadPayload.file);

        this.notification.success(
          'Upload Started',
          `Uploading file: ${renamedFile.name}`
        );
      });
      
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
