import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSetTableComponent } from './event-set-table.component';

describe('EventSetTableComponent', () => {
  let component: EventSetTableComponent;
  let fixture: ComponentFixture<EventSetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
