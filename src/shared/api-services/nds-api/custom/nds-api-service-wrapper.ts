import { Injectable } from "@angular/core";
import { AppLogService, EventService, EventSetMemberService, EventSetService, ParameterService } from "../generated";
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

    ) {
        this.setServicesBaseUrl();
    }

    private setServicesBaseUrl(): void {
        this.eventService.configuration.basePath = this.baseUrl;
        this.eventSetService.configuration.basePath = this.baseUrl;
        this.parameterService.configuration.basePath = this.baseUrl;
        this.appLogService.configuration.basePath = this.baseUrl;
        this.eventSetMemberService.configuration.basePath = this.baseUrl;
    }
}
