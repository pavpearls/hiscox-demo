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


export interface User { 
    userId?: number;
    username?: string | null;
    events?: Array<Event> | null;
}

