/**
 * NDS Api
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { GrossLoss } from './grossLoss';


export interface OrganisationClass { 
    organisationClassID?: number;
    organisationClassTypeID?: number;
    organisationClassName?: string | null;
    organisationClassCode?: string | null;
    grossLoss?: Array<GrossLoss> | null;
}

