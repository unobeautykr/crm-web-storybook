import { AppointmentTable } from '~/components/crm/search/AppointmentTable';

export default {
  title: 'SearchPage/Tables/AppointmentTable',
  component: AppointmentTable,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  return <AppointmentTable {...args} />;
};

export const Default = Template.bind();
Default.args = {
  data: [
    {
      visitType: 'ESTABLISHED',
      customer: {
        visitType: 'ESTABLISHED',
        smsEnabled: true,
        id: 520909,
        sex: 'female',
        eventSmsEnabled: true,
        name: '\uc774\ub098\ud61c',
        chartNo: '20220624_0089',
        phoneNumber: '01072770184',
        createdAt: '2022-06-24T14:45:32',
        birthday: '1994-05-05',
        status: 'active',
      },
      category: 'SURGERY',
      memo: '',
      type: 'APPOINTMENT',
      startHour: '10:00',
      deletedAt: null,
      smsSent: true,
      statusChangedAt: '2023-03-24T11:33:47',
      treatmentItems: [
        {
          isDeleted: false,
          id: 10,
          visible: true,
          category: {
            name: '\ub208',
            visible: true,
            isDeleted: false,
            id: 4,
          },
          name: '-',
        },
        {
          isDeleted: false,
          id: 21,
          visible: true,
          category: {
            name: '\ub9ac\ud504\ud305',
            visible: true,
            isDeleted: false,
            id: 6,
          },
          name: '\uc2e4\ub9ac\ud504\ud305',
        },
      ],
      counselor: null,
      status: 'SCHEDULED',
      assist: null,
      date: '2023-03-24',
      department: {
        isDeleted: false,
        id: 68,
        visible: true,
        category: {
          name: '\uc0c1\ub2f4\uc2e4',
          visible: true,
          isDeleted: false,
          id: 3,
        },
        name: '\uc0c1\ub2f44',
      },
      creator: {
        name: 'dev\uc624\ub108\uacc4\uc815',
        status: 'active',
        id: 1,
      },
      endAt: '2023-03-24T10:30:00',
      endHour: '10:30',
      id: 7247808,
      doctor: null,
      createdAt: '2023-03-24T11:33:47.122273',
      startAt: '2023-03-24T10:00:00',
      acquisitionChannel: null,
      progress: 'OPEN',
    },
    {
      visitType: 'ESTABLISHED',
      customer: {
        visitType: 'ESTABLISHED',
        smsEnabled: true,
        id: 520909,
        sex: 'female',
        eventSmsEnabled: true,
        name: '\uc774\ub098\ud61c',
        chartNo: '20220624_0089',
        phoneNumber: '01072770184',
        createdAt: '2022-06-24T14:45:32',
        birthday: '1994-05-05',
        status: 'active',
      },
      category: 'SURGERY',
      memo: '',
      type: 'APPOINTMENT',
      startHour: '10:00',
      deletedAt: null,
      smsSent: true,
      statusChangedAt: '2023-03-24T14:51:12',
      treatmentItems: [
        {
          isDeleted: false,
          id: 12,
          visible: true,
          category: {
            name: '\ucf54',
            visible: true,
            isDeleted: false,
            id: 5,
          },
          name: '-',
        },
        {
          isDeleted: false,
          id: 19,
          visible: true,
          category: {
            name: '\ub808\uc774\uc838',
            visible: true,
            isDeleted: false,
            id: 7,
          },
          name: '\uc5d1\uc140V',
        },
      ],
      counselor: null,
      status: 'REGISTERED',
      assist: null,
      date: '2023-03-24',
      department: {
        isDeleted: false,
        id: 69,
        visible: true,
        category: {
          name: '\uc0c1\ub2f4\uc2e4',
          visible: true,
          isDeleted: false,
          id: 3,
        },
        name: '\uc0c1\ub2f45',
      },
      creator: {
        name: 'dev\uc624\ub108\uacc4\uc815',
        status: 'active',
        id: 1,
      },
      endAt: '2023-03-24T10:30:00',
      endHour: '10:30',
      id: 7247805,
      doctor: null,
      createdAt: '2023-03-24T11:10:50.185372',
      startAt: '2023-03-24T10:00:00',
      acquisitionChannel: null,
      progress: 'COMPLETE',
    },
  ],
  checked: [],
  checkedAll: false,
  orderBy: [],
};

export const Empty = Template.bind();
Empty.args = {
  data: [],
  checked: [],
  checkedAll: false,
  orderBy: [],
};
