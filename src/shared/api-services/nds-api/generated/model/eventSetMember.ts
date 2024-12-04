/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EventSet } from './eventSet';
import { Event } from './event';


export interface EventSetMember { 
    eventSetMemberID?: number;
    eventID?: number;
    eventSetID?: number;
    simYear?: number;
    eventOrder?: number;
    createdBy?: string | null;
    modifiedBy?: string | null;
    event?: Event;
    eventSet?: EventSet;
}

