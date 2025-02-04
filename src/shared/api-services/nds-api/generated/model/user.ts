/**
 * NDSBackend.Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EventSet } from './eventSet';
import { Event } from './event';
import { LossLoad } from './lossLoad';


export interface User { 
    userID?: number;
    userName?: string | null;
    events?: Array<Event> | null;
    eventSets?: Array<EventSet> | null;
    lossLoads?: Array<LossLoad> | null;
}

