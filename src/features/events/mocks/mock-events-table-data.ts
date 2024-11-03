import { EventColumnItem, EventDataItem } from "../interfaces/events.interfaces";

export const MOCK_EVENT_DATA: EventDataItem[] = [
  { eventId: 35, eventType: 'RDS', eventName: '1 - Two Events - Northeast Hurricane RDS', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 36, eventType: 'RDS', eventName: '1 - Two Events - South Carolina Hurricane RDS', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 37, eventType: 'RDS', eventName: '11 - Marine Event (1) Collision', regionPeril: 'Clash - Marine', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 38, eventType: 'RDS', eventName: '11 - Marine Event (1) Cruise Liner', regionPeril: 'Clash - Marine', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 39, eventType: 'RDS', eventName: '12 - Major Complex Loss', regionPeril: 'Clash - Retail', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 40, eventType: 'RDS', eventName: '13 - Aviation Collision', regionPeril: 'Clash - Aviation', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 41, eventType: 'RDS', eventName: '15 - Liability Risk - Rail Collision', regionPeril: 'Casualty - Single Product', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 42, eventType: 'RDS', eventName: '15 - Liability Risk (Broadening of Real Estate Coverage)', regionPeril: 'Casualty - Systemic Products', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 43, eventType: 'RDS', eventName: '15 - Liability Risk (Californian Tort Reform - MICRA)', regionPeril: 'Casualty - Systemic Professional', createdBy: 'Etso Bela', createdDate: '01-Jan-2024', restricted: 'No', archived: 'No' },
  { eventId: 71, eventType: 'Post Event', eventName: 'Hurricane Ian', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Luke Mather', createdDate: '01-Oct-2022', restricted: 'No', archived: 'No' },
  { eventId: 72, eventType: 'Post Event', eventName: 'COVID', regionPeril: 'Pandemic', createdBy: 'Luke Mather', createdDate: '01-Oct-2022', restricted: 'No', archived: 'No' },
  { eventId: 73, eventType: 'Post Event', eventName: 'Hurricane Laura', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Luke Mather', createdDate: '01-Oct-2022', restricted: 'No', archived: 'No' },
  { eventId: 74, eventType: 'Post Event', eventName: 'Hurricane Sally', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Luke Mather', createdDate: '01-Oct-2022', restricted: 'No', archived: 'No' },
  { eventId: 75, eventType: 'Post Event', eventName: 'Storm Uri', regionPeril: 'US & Canada Winterstorm', createdBy: 'Luke Mather', createdDate: '13-Feb-2021', restricted: 'No', archived: 'No' },
  { eventId: 76, eventType: 'Post Event', eventName: 'European Floods', regionPeril: 'Europe Flood', createdBy: 'Etso Bela', createdDate: '25-Jun-2024', restricted: 'No', archived: 'No' },
  { eventId: 77, eventType: 'Post Event', eventName: 'Hurricane Ida', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Luke Mather', createdDate: '01-Sep-2021', restricted: 'No', archived: 'No' },
  { eventId: 78, eventType: 'Post Event', eventName: 'Ukraine', regionPeril: '<Need to agree how to populate>', createdBy: 'Luke Mather', createdDate: '24-Feb-2022', restricted: 'No', archived: 'No' },
  { eventId: 79, eventType: 'Post Event', eventName: 'Beryl', regionPeril: 'US & Caribbean Hurricane', createdBy: 'Robbie Stenning', createdDate: '01-Sep-2024', restricted: 'No', archived: 'No' }
];

export const  MOCK_EVENT_TABLE_COLUMNS: EventColumnItem[] = [
    {
      name: 'Event ID',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => a.eventId - b.eventId,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Event Type',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => a.eventType.localeCompare(b.eventType),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'RDS', value: 'RDS' },
        { text: 'Post Event', value: 'Post Event' }
      ],
      filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.eventType)
    },
    {
      name: 'Event Name',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => a.eventName.localeCompare(b.eventName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Region-Peril',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => a.regionPeril.localeCompare(b.regionPeril),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'US & Caribbean Hurricane', value: 'US & Caribbean Hurricane' },
        { text: 'Clash - Marine', value: 'Clash - Marine' },
        { text: 'Casualty - Single Product', value: 'Casualty - Single Product' }
      ],
      filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.regionPeril)
    },
    {
      name: 'Created By',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => a.createdBy.localeCompare(b.createdBy),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Created Date',
      sortOrder: null,
      sortFn: (a: EventDataItem, b: EventDataItem) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Restricted',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' }
      ],
      filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.restricted)
    },
    {
      name: 'Archived',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' }
      ],
      filterFn: (filter: string[], item: EventDataItem) => filter.includes(item.archived)
    }
  ];