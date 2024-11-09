/**
 * NDSBackend.Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface EventRequest { 
    eventID?: number;
    eventTypeID?: number;
    regionPerilID?: number;
    eventNameShort?: string | null;
    eventNameLong?: string | null;
    eventDate?: Date;
    industryLossEstimate?: number | null;
    hiscoxLossImpactRating?: string | null;
    createUserID?: number | null;
    createDate?: Date | null;
    isLossPick?: boolean | null;
    isRestrictedAccess?: boolean | null;
    isArchived?: boolean | null;
}
