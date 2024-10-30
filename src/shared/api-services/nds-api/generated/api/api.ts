export * from './event.service';
import { EventService } from './event.service';
export * from './eventSet.service';
import { EventSetService } from './eventSet.service';
export * from './nDSBackendApi.service';
import { NDSBackendApiService } from './nDSBackendApi.service';
export * from './parameter.service';
import { ParameterService } from './parameter.service';
export const APIS = [EventService, EventSetService, NDSBackendApiService, ParameterService];
