/**
 * NDS Api
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
    eventSetTypeID?: number;
    eventSetName?: string | null;
    eventSetDescription?: string | null;
    isArchived?: boolean;
    createdBy?: string | null;
    modifiedBy?: string | null;
    createDate?: Date;
    eventRequests?: Array<EventRequest> | null;
    existingEventSetId?: number | null;
}

