import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'ag-grid-enterprise'; // Import the enterprise features
import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey(
  'Using_this_{AG_Grid}_Enterprise_key_{AG-051805}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{HISCOX_INSURANCE_COMPANY_LIMITED}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{4_January_2025}____[v3]_[01]_MTczNTk0ODgwMDAwMA==a8cb7c7bc72c0793011cd8853d363c7e'
);

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch(err => console.error(err));
