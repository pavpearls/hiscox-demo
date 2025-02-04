/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LossLoadRequest } from './lossLoadRequest';
import { LossLoadMetricRequest } from './lossLoadMetricRequest';
import { GrossLossRequest } from './grossLossRequest';


export interface UploadGrossLossFileRequest { 
    lossSetID?: number;
    lossLoadRequest: LossLoadRequest;
    lossLoadMetricRequests?: Array<LossLoadMetricRequest> | null;
    grossLossRequests?: Array<GrossLossRequest> | null;
}

