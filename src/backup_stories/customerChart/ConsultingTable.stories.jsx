import { useDataTable } from '~/hooks/useDataTable';
import { ConsultingTable } from '~/components/crm/customer-chart/consulting/ConsultingTable';

export default {
  title: 'CustomerChart/Tables/ConsultingTable',
  component: ConsultingTable,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const { sorts, checked, ...dataTableProps } = useDataTable({
    sorts: {
      id: 'date',
      value: 'desc',
    },
  });

  return (
    <ConsultingTable
      {...args}
      sorts={sorts}
      checked={checked}
      {...dataTableProps}
    />
  );
};

export const Default = Template.bind();
Default.args = {
  data: [
    {
      id: 1,
      registration: {
        date: '2022-03-04',
        payments: [
          {
            id: 1234,
            status: 'queued',
          },
        ],
      },
      counselor: {
        name: 'counselor',
      },
      items: [
        {
          name: 'treatmentItem1',
          category: {
            name: 'category1',
          },
        },
        {
          name: 'treatmentItem2',
          category: {
            name: 'category1',
          },
        },
      ],
      result: {
        name: 'result',
      },
      files: [1, 2, 3],
      memo: 'memo',
    },
    {
      id: 2,
      registration: {
        date: '2022-03-05',
        payments: [
          {
            id: 1234,
            status: 'unpaid',
          },
        ],
      },
      items: [],
      files: [],
    },
    {
      id: 3,
      registration: { date: '2022-03-05', payments: [] },
      department: {
        name: 'department',
        category: {
          name: 'category',
        },
      },
      items: [],
      files: [],
    },
  ],
};

export const Empty = Template.bind();
Empty.args = {
  data: [],
};
