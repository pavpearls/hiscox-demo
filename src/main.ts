import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'ag-grid-enterprise'; // Import the enterprise features
import { LicenseManager } from 'ag-grid-enterprise';

// LicenseManager.setLicenseKey('YOUR_ENTERPRISE_LICENSE_KEY');

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch(err => console.error(err));
