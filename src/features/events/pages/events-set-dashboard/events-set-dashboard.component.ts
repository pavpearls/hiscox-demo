import { Component, OnInit } from '@angular/core';

interface ParentItemData {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number | string;
  creator: string;
  createdAt: string;
  expand: boolean;
}

interface ChildrenItemData {
  key: number;
  name: string;
  date: string;
  upgradeNum: string;
  status: string;
}

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-set-dashboard.component.html',
  styleUrls: ['./events-set-dashboard.component.scss'],
})
export class EventsSetDashboardComponent implements OnInit {
  listOfParentData: ParentItemData[] = [];
  nestedChildrenData: { [key: number]: ChildrenItemData[] } = {};

  ngOnInit(): void {
    // Mock data for parent items
    for (let i = 0; i < 3; ++i) {
      this.listOfParentData.push({
        key: i,
        name: 'Screen',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
        expand: false
      });

      // Mock nested children data for each parent
      this.nestedChildrenData[i] = [
        { key: i * 10 + 1, date: '2014-12-24 23:12:00', name: 'Production 1', upgradeNum: 'Upgraded: 56', status: 'Finished' },
        { key: i * 10 + 2, date: '2014-12-24 23:14:00', name: 'Production 2', upgradeNum: 'Upgraded: 42', status: 'In Progress' }
      ];
    }
  }
}
