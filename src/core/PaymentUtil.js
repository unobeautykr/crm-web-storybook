export const PaymentType = {
  payment: 'PAYMENT',
  payment_modification: 'PAYMENT_MODIFICATION',
  refund: 'REFUND',
  refund_modification: 'REFUND_MODIFICATION',
};

export const PaymentMethod = {
  card: 'CARD',
  cash: 'CASH',
  bank: 'BANK_TRANSFER',
  deposit: 'DEPOSIT',

  getName: (tabType, short) => {
    switch (tabType) {
      case PaymentMethod.card:
        return '카드';
      case PaymentMethod.cash:
        return '현금';
      case PaymentMethod.bank:
        return short ? '계좌' : '계좌이체';
      case PaymentMethod.deposit:
        return '예치금';
    }
  },
};
