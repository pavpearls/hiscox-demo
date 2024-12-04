/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LossSet } from './lossSet';
import { Event } from './event';
import { LossLoad } from './lossLoad';
import { EventSetType } from './eventSetType';
import { EventSetMember } from './eventSetMember';


export interface EventSet { 
    eventSetID?: number;
    eventSetTypeID?: number;
    eventSetName?: string | null;
    eventSetDescription?: string | null;
    isArchived?: boolean;
    createdBy?: string | null;
    modifiedBy?: string | null;
    createDate?: Date;
    eventSetType?: EventSetType;
    eventSetMembers?: Array<EventSetMember> | null;
    lossSets?: Array<LossSet> | null;
    lossLoads?: Array<LossLoad> | null;
    events?: Array<Event> | null;
}

