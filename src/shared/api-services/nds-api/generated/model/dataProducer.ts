/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LossLoad } from './lossLoad';


export interface DataProducer { 
    dataProducerID?: number;
    dataProducerName?: string | null;
    dataProducerDescription?: string | null;
    lossLoads?: Array<LossLoad> | null;
}

