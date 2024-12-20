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
import { DataSourceType } from './dataSourceType';
import { LossSetLoadMember } from './lossSetLoadMember';
import { GrossLoss } from './grossLoss';
import { DataProducer } from './dataProducer';


export interface LossLoad { 
    lossLoadID?: number;
    eventSetID?: number;
    dataSourceTypeID?: number;
    dataProducerID?: number;
    dataSourceName?: string | null;
    lossLoadName?: string | null;
    lossLoadDescription?: string | null;
    loadDate?: Date;
    isArchived?: boolean;
    isValid?: boolean;
    createdBy?: string | null;
    modifiedBy?: string | null;
    includeOptionalFields?: boolean | null;
    eventSet?: EventSet;
    dataSourceType?: DataSourceType;
    dataProducer?: DataProducer;
    lossSetLoadMembers?: Array<LossSetLoadMember> | null;
    grossLosses?: Array<GrossLoss> | null;
}

