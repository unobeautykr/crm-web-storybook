import { SettlementsDetailTable } from '~/components/modals/SettlementsDetailTable';

export default {
  title: 'Settlements/Tables/SettlementsDetailTable',
  component: SettlementsDetailTable,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  return <SettlementsDetailTable {...args} />;
};

export const Default = Template.bind();
Default.args = {
  data: [
    {
      cashAmount: 0,
      cashReceiptAmount: 0,
      totalAmount: 70000,
      refundCashAmount: 0,
      creditCardAmount: 70000,
      paidAt: '2022-04-05',
      refundCreditCardAmount: 0,
      bankTransferAmount: 0,
      refundBankTransferAmount: 0,
      customerId: 3,
      paidAmount: 70000,
      name: '고객3',
      refundAmount: 0,
      actualAmount: 70000,
      unpaidAmount: 0,
    },
    {
      cashAmount: 0,
      cashReceiptAmount: 0,
      totalAmount: 106666,
      refundCashAmount: 0,
      creditCardAmount: 40000,
      paidAt: '2022-04-04',
      refundCreditCardAmount: 10000,
      bankTransferAmount: 0,
      refundBankTransferAmount: 0,
      customerId: 2,
      paidAmount: 40000,
      name: '고객2',
      refundAmount: 10000,
      actualAmount: 30000,
      unpaidAmount: 0,
    },
    {
      cashAmount: 0,
      cashReceiptAmount: 0,
      totalAmount: 100000,
      refundCashAmount: 0,
      creditCardAmount: 60000,
      paidAt: '2022-04-01',
      refundCreditCardAmount: 20000,
      bankTransferAmount: 0,
      refundBankTransferAmount: 0,
      customerId: 1,
      paidAmount: 60000,
      name: '고객1',
      refundAmount: 20000,
      actualAmount: 40000,
      unpaidAmount: 0,
    },
  ],
};

export const Empty = Template.bind();
Empty.args = {
  loading: false,
  data: [],
};
