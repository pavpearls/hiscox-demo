import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  selectedTab = 'RDS';

  @ViewChild('rdsTemplate', { static: true }) rdsTemplate!: TemplateRef<any>;
  @ViewChild('postEventTemplate', { static: true }) postEventTemplate!: TemplateRef<any>;
  @ViewChild('eventResponseTemplate', { static: true }) eventResponseTemplate!: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
   
  }

  // Helper to get the current template based on the selected tab
  get currentTemplate(): TemplateRef<any> | null {
    switch (this.selectedTab) {
      case 'rds':
        return this.rdsTemplate;
      case 'postEvent':
        return this.postEventTemplate;
      case 'eventResponse':
        return this.eventResponseTemplate;
      default:
        return null;
    }
  }

  

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
  }
}
