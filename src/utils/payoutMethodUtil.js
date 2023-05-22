export const payoutMethod = {
  card: 'CARD',
  bank_transfer: 'BANK_TRANSFER',
  cash: 'CASH',

  getName: (method) => {
    switch (method) {
      case payoutMethod.card:
        return '카드';
      case payoutMethod.bank_transfer:
        return '계좌이체';
      case payoutMethod.cash:
        return '현금';
    }
  },
};
