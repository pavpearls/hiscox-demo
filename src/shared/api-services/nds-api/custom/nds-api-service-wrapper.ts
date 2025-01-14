import { Injectable } from "@angular/core";
import { AppLogService, EventService, EventSetMemberService, EventSetService, FileUploadService, GrossLossService, LossLoadService, LossSetService, ParameterService } from "../generated";
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})

export class NdsApiServiceWrapper {
    private baseUrl: string = environment.baseUrl;
    constructor(
        public eventService: EventService,
        public eventSetService: EventSetService,
        public parameterService: ParameterService,
        public appLogService: AppLogService,
        public eventSetMemberService: EventSetMemberService,
        public fileUploadService: FileUploadService,
        public grossLossService: GrossLossService,
        public lossSetService: LossSetService,
        public lossLoadService: LossLoadService

    ) {
        this.setServicesBaseUrl();
    }

    private setServicesBaseUrl(): void {
        this.eventService.configuration.basePath = this.baseUrl;
        this.eventSetService.configuration.basePath = this.baseUrl;
        this.parameterService.configuration.basePath = this.baseUrl;
        this.appLogService.configuration.basePath = this.baseUrl;
        this.eventSetMemberService.configuration.basePath = this.baseUrl;
        this.fileUploadService.configuration.basePath = this.baseUrl;
        this.grossLossService.configuration.basePath = this.baseUrl;
        this.lossSetService.configuration.basePath = this.baseUrl;
        this.lossLoadService.configuration.basePath = this.baseUrl;
    }
}
