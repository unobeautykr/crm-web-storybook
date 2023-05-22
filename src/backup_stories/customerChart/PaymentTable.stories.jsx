import { useDataTable } from '~/hooks/useDataTable';
import { PaymentTable } from '~/components/crm/customer-chart/payment/PaymentTable';

export default {
  title: 'CustomerChart/Tables/PaymentTable',
  component: PaymentTable,
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
    <PaymentTable
      {...args}
      sorts={sorts}
      checked={checked}
      collapsed={[]}
      {...dataTableProps}
    />
  );
};

export const Default = Template.bind();
Default.args = {
  data: [
    {
      refundAmount: 0,
      creator: {
        id: 1,
        name: 'dev',
      },
      manager: {
        id: 1,
        name: 'dev',
      },
      transactions: [
        {
          id: 559394,
          createdAt: '2022-04-13T10:17:24',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: false,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 10000,
            },
          ],
          type: 'PAYMENT_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559284,
          createdAt: '2022-04-04T12:32:51',
          memo: '',
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 0,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: 60000,
            },
          ],
          type: 'PAYMENT',
          paidAt: '2022-04-04',
        },
        {
          id: 559283,
          createdAt: '2022-04-04T12:32:21',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 50000,
            },
          ],
          type: 'PAYMENT',
          paidAt: '2022-04-04',
        },
      ],
      registration: {
        date: '2022-04-04',
        customer: {
          id: 482552,
          sex: 'female',
          birthday: null,
          chartNo: '20220404_0049',
          name: '12341234',
        },
      },
      deletedAt: null,
      discountAmount: 0,
      acquisitionChannel: null,
      requestAmount: 120000,
      type: 'PAYMENT',
      id: 6932217,
      counselor: null,
      memo: '',
      status: 'paid',
      totalAmount: true,
      payoutAmount: 120000,
      paidAmount: 120000,
      unpaidAmount: 0,
      isNewCustomer: false,
      createdAt: '2022-04-04T12:32:21.502839',
      items: [
        {
          id: 1084621,
          discountAmount: 0,
          refundCount: 0,
          isFree: false,
          vatFree: false,
          useCount: 0,
          vatExclusivePrice: 9091,
          treatmentCount: 1,
          price: 10000,
          discountReason: null,
          type: 'treatment_item',
          treatmentItem: {
            id: 13,
            name: '-',
            category: {
              id: 6,
              name: '리프팅',
            },
            order: 8,
          },
          remainingCount: 1,
        },
        {
          id: 1084435,
          discountAmount: 0,
          refundCount: 0,
          isFree: false,
          vatFree: true,
          useCount: 0,
          vatExclusivePrice: 110000,
          treatmentCount: 1,
          price: 110000,
          discountReason: null,
          type: 'treatment_item',
          treatmentItem: {
            id: 16,
            name: '이마',
            category: {
              id: 8,
              name: '보톡스',
            },
            order: 17,
          },
          remainingCount: 1,
        },
      ],
      rowIndex: 1,
    },
    {
      refundAmount: 600,
      creator: {
        id: 1,
        name: 'dev',
      },
      manager: {
        id: 1,
        name: 'dev',
      },
      transactions: [
        {
          id: 559392,
          createdAt: '2022-04-12T10:29:46',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: 100,
            },
          ],
          type: 'REFUND_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559391,
          createdAt: '2022-04-12T10:19:14',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 500,
            },
          ],
          type: 'REFUND_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559384,
          createdAt: '2022-04-11T17:40:56',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: -29000,
            },
            {
              vatFree: true,
              cashReceipt: 1,
              companyName: '',
              method: 'CASH',
              amount: 10,
            },
          ],
          type: 'PAYMENT_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559294,
          createdAt: '2022-04-04T14:49:34',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: -3000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: -3000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: -4000,
            },
          ],
          type: 'REFUND_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559293,
          createdAt: '2022-04-04T14:49:34',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 20000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: -10000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: -10000,
            },
          ],
          type: 'PAYMENT_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559292,
          createdAt: '2022-04-04T14:49:08',
          memo: null,
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: -2000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: -2000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: -1000,
            },
          ],
          type: 'REFUND_MODIFICATION',
          paidAt: '2022-04-04',
        },
        {
          id: 559291,
          createdAt: '2022-04-04T14:48:51',
          memo: '',
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 5000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: 5000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: 5000,
            },
          ],
          type: 'REFUND',
          paidAt: '2022-04-04',
        },
        {
          id: 559290,
          createdAt: '2022-04-04T14:48:38',
          memo: '',
          creator: {
            id: 1,
            name: 'dev',
          },
          items: [
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CARD',
              amount: 10000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'CASH',
              amount: 10000,
            },
            {
              vatFree: true,
              cashReceipt: 0,
              companyName: '',
              method: 'BANK_TRANSFER',
              amount: 10000,
            },
          ],
          type: 'PAYMENT',
          paidAt: '2022-04-04',
        },
      ],
      registration: {
        date: '2022-04-04',
        customer: {
          id: 34963,
          sex: 'male',
          birthday: '1990-08-16',
          chartNo: '20220222_0020',
          name: '이용준',
        },
      },
      deletedAt: null,
      discountAmount: 0,
      acquisitionChannel: null,
      requestAmount: 30000,
      type: 'PAYMENT',
      id: 6932221,
      counselor: null,
      memo: '',
      status: 'part_refund',
      totalAmount: true,
      payoutAmount: 1010,
      paidAmount: 410,
      unpaidAmount: 28990,
      isNewCustomer: false,
      createdAt: '2022-04-04T14:45:06.674262',
      items: [
        {
          id: 1084439,
          discountAmount: 0,
          refundCount: 0,
          isFree: false,
          vatFree: true,
          useCount: 0,
          vatExclusivePrice: 30000,
          treatmentCount: 1,
          price: 30000,
          discountReason: null,
          type: 'treatment_item',
          treatmentItem: {
            id: 17,
            name: '사각턱',
            category: {
              id: 8,
              name: '보톡스',
            },
            order: 18,
          },
          remainingCount: 1,
        },
      ],
      rowIndex: 2,
    },
    {
      refundAmount: 0,
      creator: {
        id: 1,
        name: 'dev',
      },
      manager: {
        id: 1,
        name: 'dev',
      },
      transactions: [],
      registration: {
        date: '2022-03-29',
        customer: {
          id: 481027,
          sex: 'female',
          birthday: null,
          chartNo: '20220315_0042',
          name: '이나혜2',
        },
      },
      deletedAt: null,
      discountAmount: 0,
      acquisitionChannel: null,
      requestAmount: 110000,
      type: 'PAYMENT',
      id: 6932153,
      counselor: null,
      memo: '',
      status: 'unpaid',
      totalAmount: true,
      payoutAmount: 0,
      paidAmount: 0,
      unpaidAmount: 110000,
      isNewCustomer: false,
      createdAt: '2022-03-30T10:24:46.585766',
      items: [
        {
          id: 1084394,
          discountAmount: 0,
          refundCount: 0,
          isFree: false,
          vatFree: true,
          useCount: 0,
          vatExclusivePrice: 110000,
          treatmentCount: 1,
          price: 110000,
          discountReason: null,
          type: 'treatment_item',
          treatmentItem: {
            id: 16,
            name: '이마',
            category: {
              id: 8,
              name: '보톡스',
            },
            order: 17,
          },
          remainingCount: 1,
        },
      ],
      rowIndex: 3,
    },
  ],
};

export const Empty = Template.bind();
Empty.args = {
  data: [],
};
