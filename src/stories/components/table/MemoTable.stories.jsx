import moment from 'moment';
import { useDataTable } from '~/hooks/useDataTable';
import QuillText from '~/components/quill/QuillText';
import { DataTable } from '~/components/DataTable/DataTable';
import { AppointmentStatus } from '~/core/appointmentStatus';

export default {
  title: 'Component/Table',
  component: DataTable,
  id: 'component-table',
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const { sorts, checked, onChangeChecked, onChangeSorts } = useDataTable({
    sorts: {
      id: 'startAt',
      value: 'desc',
    },
  });
  return (
    <DataTable
      {...args}
      sorts={sorts}
      checked={checked}
      onChangeChecked={onChangeChecked}
      onChangeSorts={onChangeSorts}
    />
  );
};
export const Memo = Template.bind();

const data = [
  {
    rowIndex: 2,
    category: 'CONSULTING',
    assist: { name: '김지현', id: 20 },
    counselor: { name: '김지현', id: 20 },
    createdAt: '2022-06-03T11:30:00.407548',
    creator: { name: 'dev', id: 1 },
    customer: {
      sex: 'female',
      id: 420754,
      chartNo: '20220311_0028',
      name: '이나혜',
      birthday: '1994-05-05',
    },
    deletedAt: null,
    department: {
      name: '관리2실',
      id: 13,
      category: { name: '시술/관리', id: 4 },
    },
    doctor: { name: '김지현', id: 20 },
    endHour: '15:30',
    id: 7192508,
    memo: '<p>수술부위 2회 통증,</p><p>재방문예정</p>',
    date: '2022-06-03',
    smsSent: true,
    startHour: '15:00',
    status: 'SCHEDULED',
    treatmentItems: [
      { name: '눈매', id: 11, category: { name: '눈', id: 4 } },
      { name: '필러/보톡스', id: 12, category: { name: '보톡스', id: 5 } },
    ],
    type: 'APPOINTMENT',
  },
  {
    rowIndex: 1,
    category: 'CONSULTING',
    assist: { name: '김지현', id: 20 },
    counselor: { name: '김지현', id: 20 },
    createdAt: '2022-06-03T11:29:55.407548',
    creator: { name: 'dev', id: 1 },
    customer: {
      sex: 'female',
      id: 420754,
      chartNo: '20220311_0028',
      name: '이나혜',
      birthday: '1994-05-05',
    },
    deletedAt: null,
    department: {
      name: '관리1실',
      id: 12,
      category: { name: '시술/관리', id: 4 },
    },
    doctor: { name: '김지현', id: 20 },
    endHour: '15:30',
    id: 7192507,
    memo: '<p><strong>예약메모입니다</strong></p><p><span style="background-color: #9933ff; color: #ffffff;">테스트</span></p>',
    date: '2022-06-03',
    smsSent: true,
    startHour: '15:00',
    status: 'SCHEDULED',
    treatmentItems: [{ name: '눈매', id: 11, category: { name: '눈', id: 4 } }],
    type: 'APPOINTMENT',
  },
];
const schema = {
  columns: [
    [
      {
        id: 'no',
        name: 'No.',
        rowSpan: '100%',
        value: (item) => item.rowIndex,
      },
      {
        id: 'startAt',
        name: '예약일',
        sortable: true,
        value: (item) => {
          return `${moment(item.date).format('YYYY-MM-DD')} ${item.startHour}-${
            item.endHour
          }`;
        },
        style: {
          textDecoration: 'underline',
        },
      },
      {
        id: 'smsSent',
        name: '예약문자',
        value: (item) => (item.smsSent ? '설정' : '미설정'),
      },
      {
        id: 'status',
        name: '예약상태',
        value: (item) => (
          <p
            style={{
              color:
                item.status === AppointmentStatus.canceled
                  ? '#E02020'
                  : 'inherit',
            }}
          >
            {AppointmentStatus.getName(item.status)}
          </p>
        ),
      },
      {
        id: 'category',
        name: '예약종류',
        value: (item) => {
          let typeStr;
          if (item.category === 'consulting') typeStr = '상담예약';
          if (item.category === 'treatment') typeStr = '진료예약';
          if (item.category === 'surgery') typeStr = '시수술예약';
          return typeStr;
        },
      },
      {
        id: 'departmentCategory',
        name: '부서',
        value: (item) => item.department.category.name,
      },
      {
        id: 'departmentName',
        name: '세부부서',
        value: (item) => item.department.name,
      },
      {
        id: 'counselor',
        name: '상담사',
        value: (item) => item.counselor?.name,
        style: {
          minWidth: '50px',
        },
      },
      {
        id: 'doctor',
        name: '의사',
        value: (item) => item.doctor?.name,
        style: {
          minWidth: '50px',
        },
      },
      {
        id: 'assist',
        name: '어시스트',
        value: (item) => item.assist?.name,
        style: {
          minWidth: '50px',
        },
      },
      {
        id: 'categoryName',
        name: '카테고리',
        value: ({ treatmentItems }) => {
          return treatmentItems.map((v) => v.category?.name);
        },
        style: {
          textAlign: 'left',
          minWidth: '150px',
          whiteSpace: 'initial',
        },
      },
      {
        id: 'itemName',
        name: '시/수술명',
        value: ({ treatmentItems }) => {
          return treatmentItems.map((v) => v?.name);
        },
        style: {
          textAlign: 'left',
          minWidth: '200px',
          whiteSpace: 'initial',
        },
      },

      {
        id: 'createdName',
        name: '작성자',
        value: (item) => item.creator?.name,
      },
      {
        id: 'createdAt',
        name: '작성일',
        value: (item) => {
          return `${moment(item.createdAt).format('YYYY-MM-DD HH:mm')}`;
        },
      },
    ],
    [
      {
        id: 'memo',
        name: '메모',
        rowSpan: 1,
        colSpan: '100%',
        component: (attr) => {
          const { item } = attr;
          return (
            <QuillText
              value={item.memo}
              maxLine={4}
              style={{ minHeight: '16px' }}
            />
          );
        },
        style: { textAlign: 'left' },
      },
    ],
  ],
};

Memo.args = {
  data: data,
  schema: schema,
  styleType: 'chart',
};
