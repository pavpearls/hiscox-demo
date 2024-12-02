/**
 * NDSBackend.Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EventRequest } from './eventRequest';


export interface EventSetAndEventsRequest { 
    eventSetID?: number;
    eventTypeID?: number | null;
    eventSetName?: string | null;
    eventSetDescription?: string | null;
    isArchived?: boolean | null;
    createdBy?: string | null;
    modifiedBy?: string | null;
    createUserID?: number | null;
    createDate?: Date | null;
    eventRequests?: Array<EventRequest> | null;
    existingEventSetId?: number | null;
}

