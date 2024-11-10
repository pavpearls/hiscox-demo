import { Injectable } from "@angular/core";
import { AppLogService, EventService, EventSetMemberService, EventSetService, ParameterService } from "../generated";
import { EventTypeService } from "../generated/api/eventType.service";
import { RegionPerilService } from "../generated/api/regionPeril.service";
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})

export class NdsApiServiceWrapper {
    private baseUrl: string = environment.baseUrl;
    constructor(
        public eventService: EventService,
        public eventSetService: EventSetService,
        public eventTypeService: EventTypeService,
        public parameterService: ParameterService,
        public regionPerilService: RegionPerilService,
        public appLogService: AppLogService,
        public eventSetMemberService: EventSetMemberService,

    ) {
        this.setServicesBaseUrl();
    }

    private setServicesBaseUrl(): void {
        this.eventService.configuration.basePath = this.baseUrl;
        this.eventSetService.configuration.basePath = this.baseUrl;
        this.eventTypeService.configuration.basePath = this.baseUrl;
        this.parameterService.configuration.basePath = this.baseUrl;
        this.regionPerilService.configuration.basePath = this.baseUrl;
        this.appLogService.configuration.basePath = this.baseUrl;
        this.eventSetMemberService.configuration.basePath = this.baseUrl;
    }
}