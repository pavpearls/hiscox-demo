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
import { LossLoad } from './lossLoad';


export interface LossSetLoadMember { 
    lossSetLoadMemberID?: number;
    lossSetID?: number;
    lossLoadID?: number;
    createdBy?: string | null;
    modifiedBy?: string | null;
    lossLoad?: LossLoad;
    lossSet?: LossSet;
}

