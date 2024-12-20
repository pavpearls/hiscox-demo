/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterDataType } from './parameterDataType';
import { GrossLoss } from './grossLoss';


export interface GrossLossParameter { 
    grossLossParameterID?: number;
    parameterDataTypeID?: number;
    grossLossID?: number;
    grossLossParameterName?: string | null;
    grossLossParameterValue?: string | null;
    createdBy?: string | null;
    modifiedBy?: string | null;
    parameterDataType?: ParameterDataType;
    grossLoss?: GrossLoss;
}

