/**
 * NDSBackend.Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { User } from './user';
import { EventType } from './eventType';
import { EventSetMember } from './eventSetMember';


export interface Event { 
    eventId?: number;
    eventTypeId?: number;
    regionPerilId?: number;
    name?: string | null;
    description?: string | null;
    eventDate?: Date;
    industryLossEstimate?: number | null;
    hiscoxLossImpact?: string | null;
    isRestrictedAccess?: boolean | null;
    isArchived?: boolean | null;
    createUserId?: number | null;
    createDate?: Date | null;
    createUser?: User;
    eventType?: EventType;
    eventSetMembers?: Array<EventSetMember> | null;
}

