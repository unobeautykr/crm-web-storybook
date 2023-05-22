export const smsStatus = {
  pending: 'PENDING',
  canceled: 'CANCELED',
  success: 'SUCCESS',
  failure: 'FAILURE',
  on_progress: 'ON_PROGRESS',
  invalid: 'INVALID',

  getName: (status) => {
    switch (status) {
      case smsStatus.pending:
        return '전송대기';
      case smsStatus.canceled:
        return '전송취소';
      case smsStatus.success:
        return '전송성공';
      case smsStatus.failure:
        return '전송실패';
      case smsStatus.on_progress:
        return '전송중';
      case smsStatus.invalid:
        return '전송불가';
    }
  },
};
