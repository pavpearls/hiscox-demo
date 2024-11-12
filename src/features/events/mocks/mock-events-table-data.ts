import { EventColumnItem, EventDataItem } from "../interfaces/events.interfaces";

export const MOCK_EVENT_DATA: any[] = [{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":21,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 10 Hurricane Ian - Low $20bn","eventNameLong":"Test 10 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":20,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 9 Hurricane Ian - Low $20bn","eventNameLong":"Test 9 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":19,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 8 Hurricane Ian - Low $20bn","eventNameLong":"Test 8 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":18,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 7 Hurricane Ian - Low $20bn","eventNameLong":"Test 7 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":17,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 6 Hurricane Ian - Low $20bn","eventNameLong":"Test 6 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":16,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 5 Hurricane Ian - Low $20bn","eventNameLong":"Test 5 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":15,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 4 Hurricane Ian - Low $20bn","eventNameLong":"Test 4 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":14,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 3 Hurricane Ian - Low $20bn","eventNameLong":"Test 3 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":13,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 2 Hurricane Ian - Low $20bn","eventNameLong":"Test 2 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":12,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"Test 1 Hurricane Ian - Low $20bn","eventNameLong":"Test 1 Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":11,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"New Hurricane Ian - Low $20bn","eventNameLong":"New Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":10,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"New Hurricane Ian - Low $20bn","eventNameLong":"New Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":10,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":9,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"New Hurricane Ian - Low $20bn","eventNameLong":"New Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":20,"hiscoxLossImpactRating":"HIGH","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":8,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"New Hurricane Ian - Low $20bn","eventNameLong":"New Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":20,"hiscoxLossImpactRating":"LOW","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true},{"createUser":{"userID":3,"userName":"Robbie Stenning","events":[],"eventSets":[]},"eventType":{"eventTypeID":1,"eventTypeName":"RDS","eventTypeAltName":"RDS","events":[],"eventSets":[]},"regionPeril":null,"eventSetMembers":[],"eventID":7,"eventTypeID":1,"regionPerilID":10,"eventNameShort":"New Hurricane Ian - Low $20bn","eventNameLong":"New Hurricane Ian - Low $20bn","eventDate":"2022-09-01T00:00:00","industryLossEstimate":20,"hiscoxLossImpactRating":"LOW","createUserID":3,"createDate":"2022-09-12T00:00:00","isLossPick":null,"isRestrictedAccess":false,"isArchived":true}]

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