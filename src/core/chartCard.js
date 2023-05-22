export const StatusConfig = {
  APPOINTMENT: { label: '예약', color: '#FF9D5F', apiPath: '/appointments' },
  CANCELED: {
    label: '예약 - 취소',
    color: '#FF3D3D',
    apiPath: '/appointments',
  },
  NO_SHOW: {
    label: '예약 - 미방문',
    color: '#E6E6E6',
    apiPath: '/appointments',
  },
  REGISTRATION: { label: '내원', color: '#2C62F6', apiPath: '/registrations' },
  CONSULTING: { label: '상담', color: '#B7E4B0', apiPath: '/consultings' },
  PAYMENT: { label: '수납', color: '#5080FA', apiPath: '/payments' },
  SURGERY: { label: '시/수술', color: '#FF508C', apiPath: '/surgeries' },
  TREATMENT: { label: '진료', color: '#56B1E4', apiPath: '/treatments' },
  NURSE_CARE: { label: '간호', color: '#D1E20F', apiPath: '/nurse_cares' },
  NURSE_OPERATION: {
    label: '수술간호',
    color: '#6DCDD1',
    apiPath: '/nurse_operations',
  },
  SKINCARE: { label: '피부관리', color: '#A4A4A4', apiPath: '/skincares' },
};
