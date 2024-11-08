/**
 * NDSBackend.Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Event } from './event';
import { RegionPerilType } from './regionPerilType';


export interface RegionPeril { 
    regionPerilID?: number;
    regionPerilTypeID?: number | null;
    regionPerilName?: string | null;
    regionPerilType?: RegionPerilType;
    events?: Array<Event> | null;
}

