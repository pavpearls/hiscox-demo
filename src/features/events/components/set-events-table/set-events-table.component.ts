import { Component, Input, OnInit } from '@angular/core';

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
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.scss']
})
export class NestedTableComponent implements OnInit {
  @Input() parentData: ParentItemData[] = [];
  @Input() childrenData: { [key: number]: ChildrenItemData[] } = {};

  constructor() {}

  ngOnInit(): void {}

  toggleExpand(parentItem: ParentItemData): void {
    parentItem.expand = !parentItem.expand;
  }

  onPublish(parentItem: ParentItemData): void {
    console.log('Publish:', parentItem);
  }

  onAction1(childItem: ChildrenItemData): void {
    console.log('Action 1:', childItem);
  }

  onAction2(childItem: ChildrenItemData): void {
    console.log('Action 2:', childItem);
  }

  onStop(childItem: ChildrenItemData): void {
    console.log('Stop:', childItem);
  }

  onMore(childItem: ChildrenItemData): void {
    console.log('More:', childItem);
  }
}
