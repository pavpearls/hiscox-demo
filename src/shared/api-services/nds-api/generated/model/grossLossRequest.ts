/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GrossLossRequest { 
    grossLossID?: number;
    lossLoadID?: number;
    currencyID?: number;
    organisationClassID?: number;
    eventID?: number;
    grossLossAmount?: number;
    aggregateLossAmount?: number;
    reinstatementROL?: number;
    yearOfAccount?: Date;
    yearOfAccountLossSplit?: number;
    createdBy?: string | null;
    modifiedBy?: string | null;
}

