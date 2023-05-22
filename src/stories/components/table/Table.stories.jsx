import { DataTable } from '~/components/DataTable/DataTable';
import { UnderlineButton } from '~/components/UnderlineButton';

export default {
  title: 'Component/Table/Default',
  component: DataTable,
  id: 'component-table-default',
  parameters: {
    element: true,
  },
};

const Template = (args) => <DataTable {...args} />;
export const Default = Template.bind();

const data = [
  {
    name: '박지웅',
    level: 'VVIP',
    consultedCount: 9,
    treatmentCount: 9,
    surgeryCount: 6,
    paymentCount: 2,
    requestAmount: 2363000,
    refundAmount: 2000000,
    paidAmount: 0,
    unpaidAmount: 32400000,
    recommendCount: 1,
  },
  {
    name: '김성현',
    level: 'VVIP',
    consultedCount: 9,
    treatmentCount: 9,
    surgeryCount: 6,
    paymentCount: 2,
    requestAmount: 2363000,
    refundAmount: 2000000,
    paidAmount: 0,
    unpaidAmount: 32400000,
    recommendCount: 1,
  },
  {
    name: '노재경',
    level: 'VVIP',
    consultedCount: 9,
    treatmentCount: 9,
    surgeryCount: 6,
    paymentCount: 2,
    requestAmount: 2363000,
    refundAmount: 2000000,
    paidAmount: 0,
    unpaidAmount: 32400000,
    recommendCount: 1,
  },
];
const schema = {
  columns: [
    {
      id: 'name',
      name: '고객명',
      component: (attr) => {
        const { item } = attr;
        return (
          <UnderlineButton size="s" style={{ margin: '0 auto' }}>
            {item.name}
          </UnderlineButton>
        );
      },
    },
    {
      id: 'level',
      name: '등급',
      value: (item) => item.level,
    },
    {
      id: 'consultedCount',
      name: '상담건수',
      value: (item) => item.consultedCount.toLocaleString(),
    },
    {
      id: 'treatmentCount',
      name: '진료건수',
      value: (item) => item.treatmentCount.toLocaleString(),
    },
    {
      id: 'surgeryCount',
      name: '시/수술건수',
      value: (item) => item.surgeryCount.toLocaleString(),
    },
    {
      id: 'paymentCount',
      name: '수납건수',
      value: (item) => item.paymentCount.toLocaleString(),
    },
    {
      id: 'requestAmount',
      name: '청구액',
      value: (item) => `₩${item.requestAmount.toLocaleString()}`,
    },
    {
      id: 'refundAmount',
      name: '환불액',
      value: (item) => `₩${item.refundAmount.toLocaleString()}`,
    },
    {
      id: 'paidAmount',
      name: '수납액',
      value: (item) => `₩${item.paidAmount.toLocaleString()}`,
    },
    {
      id: 'unpaidAmount',
      name: '미수액',
      value: (item) => `₩${item.unpaidAmount.toLocaleString()}`,
    },
    {
      id: 'recommendCount',
      name: '소개자수',
      value: (item) => item.recommendCount.toLocaleString(),
    },
  ],
};

Default.args = {
  data: data,
  schema: schema,
};
