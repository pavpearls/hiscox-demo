export * from './event.service';
import { EventService } from './event.service';
export * from './nDSBackendApi.service';
import { NDSBackendApiService } from './nDSBackendApi.service';
export const APIS = [EventService, NDSBackendApiService];
