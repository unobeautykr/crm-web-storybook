import { useState, useEffect } from 'react';
import update from 'immutability-helper';
import { PaymentMethod, PaymentType } from '~/core/PaymentUtil';

export const usePayout = () => {
  // vat, vatFree로 데이터를 분리
  // 중복 히스토리 데이터는 합산해서 보여줘야함
  const [cashReceiptAmount, setCashReceiptAmount] = useState({
    vat: 0,
    vatFree: 0,
  });

  const [cashReceipt, setCashReceipt] = useState({
    vat: true,
    vatFree: true,
  });

  const [originPayoutList, setOriginPayoutList] = useState({
    vat: [],
    vatFree: [],
  });
  const [payoutList, setPayoutList] = useState({
    vat: [],
    vatFree: [],
  });

  const [originRefundList, setOriginRefundList] = useState({
    vat: [],
    vatFree: [],
  });
  const [refundList, setRefundList] = useState({
    vat: [],
    vatFree: [],
  });

  const setInit = (transactions = []) => {
    let payout = transactions
      .filter(
        (v) =>
          !v.canceledAt &&
          (v.type === PaymentType.payment ||
            v.type === PaymentType.payment_modification)
      )
      .map((v) => v.items)
      .flat();
    let refund = transactions
      .filter(
        (v) =>
          !v.canceledAt &&
          (v.type === PaymentType.refund ||
            v.type === PaymentType.refund_modification)
      )
      .map((v) => v.items)
      .flat();

    let updateRefundList = {
      vat: mergeData(
        refund.filter((v) => !v.vatFree),
        true
      ),
      vatFree: mergeData(
        refund.filter((v) => v.vatFree),
        true
      ),
    };

    const updatePayoutList = {
      vat: mergeData(
        [
          ...payout.filter((v) => !v.vatFree),
          ...updateRefundList.vat.map((v) => {
            return { ...v, refundAmount: v.amount, amount: 0 };
          }),
        ],
        true
      ),
      vatFree: mergeData(
        [
          ...payout.filter((v) => v.vatFree),
          ...updateRefundList.vatFree.map((v) => {
            return { ...v, refundAmount: v.amount, amount: 0 };
          }),
        ],
        true
      ),
    };

    const updateCashReceipt = {
      vat: Boolean(sumCashData(updatePayoutList, updateRefundList).vat),
      vatFree: Boolean(sumCashData(updatePayoutList, updateRefundList).vatFree),
    };

    setOriginPayoutList({
      vat: updatePayoutList.vat.map((v) => ({
        ...v,
        amount: 0,
        refundAmount: 0,
        cashReceipt: updateCashReceipt.vat,
      })),
      vatFree: updatePayoutList.vatFree.map((v) => ({
        ...v,
        amount: 0,
        refundAmount: 0,
        cashReceipt: updateCashReceipt.vatFree,
      })),
    });

    setPayoutList(updatePayoutList);
    setCashReceipt(updateCashReceipt);

    setRefundList(updateRefundList);
    setOriginRefundList({
      vat: updateRefundList.vat.map((v) => ({
        ...v,
        amount: 0,
        cashReceipt: updateCashReceipt.vat,
      })),
      vatFree: updateRefundList.vatFree.map((v) => ({
        ...v,
        amount: 0,
        cashReceipt: updateCashReceipt.vatFree,
      })),
    });
  };

  useEffect(() => {
    setCashReceiptAmount(sumCashData(payoutList, refundList));
  }, [payoutList, refundList]);

  const sumCashData = (payoutList, refundList) => {
    let result = {
      vat: 0,
      vatFree: 0,
    };

    ['vat', 'vatFree'].map((name) => {
      payoutList[name]
        .filter(
          (v) =>
            v.method === PaymentMethod.cash || v.method === PaymentMethod.bank
        )
        .map((v) => {
          if (v.cashReceipt) {
            // 현금영수증을 설정하는 경우
            // 새로 생성된 인풋이거나/기존 저장된 금액에 대해 변경사항이 없다면, 현재 입력값이 현금영수증 금액
            if (
              (!v.originCashReceiptAmount && !v.originAmount) ||
              v.amount === v.originCashReceiptAmount
            ) {
              result[name] += v.amount;
            } else if (v.originCashReceiptAmount !== v.amount) {
              // diff만큼 현금영수증 금액 수정
              result[name] += Math.max(
                v.originCashReceiptAmount - (v.originAmount - v.amount),
                0
              );
            }
          } else {
            // 현금영수증을 해제하는 경우
            // 금액이 같거나/추가된 경우 기존 현금영수증 금액 유지
            if (!v.originCashReceiptAmount || v.amount >= v.originAmount) {
              result[name] += v.originCashReceiptAmount ?? 0;
            } else {
              // 기존 저장된 금액을 작게 수정한 경우, diff만큼 현금영수증 금액 수정
              result[name] += Math.max(
                v.originCashReceiptAmount - (v.originAmount - v.amount),
                0
              );
            }
          }
        });

      refundList[name]
        .filter((v) => v.cashReceipt)
        .map((v) => {
          if (v.cashReceipt)
            result[name] -= v.originCashReceiptAmount || v.amount;
        });
    });
    return result;
  };

  // 중복 히스토리 합산
  const mergeData = (list, mergeCashReceipt, mergeRefund) => {
    let result = [];
    const mergeMethod = [
      PaymentMethod.card,
      PaymentMethod.cash,
      PaymentMethod.bank,
      PaymentMethod.deposit,
    ];

    mergeMethod.map((method) => {
      JSON.parse(JSON.stringify(list))
        .filter((v) => v.method === method)
        .map((v) => {
          v.originAmount = 0;
          v.originCashReceiptAmount = 0;
          v.refundAmount = v.refundAmount ?? 0;
          v.cashReceipt = Boolean(v.cashReceipt);
          // method, companyName가 같은 경우에만 합치기
          if (
            result.find(
              (r) =>
                r.method === method &&
                v.companyName === r.companyName &&
                v.customCompanyName === r.customCompanyName &&
                (mergeCashReceipt || v.cashReceipt === r.cashReceipt)
            )
          ) {
            let i = result.findIndex(
              (r) =>
                r.method === method &&
                v.companyName === r.companyName &&
                v.customCompanyName === r.customCompanyName &&
                (mergeCashReceipt || v.cashReceipt === r.cashReceipt)
            );
            result[i].amount += v.amount;

            // 누적 환불액
            if (v.refundAmount) {
              if (mergeRefund) {
                result[i].amount -= v.refundAmount;
              } else {
                result[i].refundAmount += v.refundAmount;
              }
            }

            // 누적 현금영수증
            if (v.cashReceipt) {
              result[i].originCashReceiptAmount += v.amount;
            }

            // 기존 저장되어있던 금액
            result[i].originAmount += v.amount;
          } else {
            if (v.cashReceipt) v.originCashReceiptAmount = v.amount;
            v.originAmount = v.amount;
            if (mergeRefund) {
              v.amount -= v.refundAmount;
            }
            result.push(v);
          }
        });
    });

    return result;
  };

  const updateReceipt = (vatFree, checked) => {
    setCashReceipt((list) => {
      list[vatFree ? 'vatFree' : 'vat'] = checked;
      return { ...list };
    });

    setPayoutList((list) => {
      list[vatFree ? 'vatFree' : 'vat'].map((v) => {
        if (v.method === PaymentMethod.cash || v.method === PaymentMethod.bank)
          v.cashReceipt = checked;
      });
      return { ...list };
    });
  };

  const updateRefundList = (vatFree, update) => {
    if (!update) return;
    setRefundList((list) => {
      list[vatFree ? 'vatFree' : 'vat'] = update;
      return { ...list };
    });
  };

  const updatePayoutList = (vatFree, idx, updateObj) => {
    if (!updateObj) return;
    if (
      updateObj.method === PaymentMethod.cash ||
      updateObj.method === PaymentMethod.bank
    )
      updateObj.cashReceipt = cashReceipt[vatFree ? 'vatFree' : 'vat'];
    updateObj.idx = idx;

    let p = { ...payoutList };
    let target = p[vatFree ? 'vatFree' : 'vat'];
    if (!isNaN(idx) && idx > -1) target[idx] = updateObj;
    else target.push(updateObj);
    setPayoutList(p);
  };

  const deletePayoutList = (vatFree, idx) => {
    if (typeof idx !== 'number') return;
    setPayoutList((list) => {
      return update(list, {
        [vatFree ? 'vatFree' : 'vat']: {
          $splice: [[idx, 1]],
        },
      });
    });
  };

  const spliceToReceipt = (list) => {
    return list
      .map((v) => {
        // 변경금액 없는 경우, 기존 현금영수증 상태 유지
        if (v.originAmount === v.amount)
          v.cashReceipt = Boolean(v.originCashReceiptAmount);

        // 크게 수정하는 경우
        if (
          v.originAmount < v.amount &&
          v.cashReceipt !== Boolean(v.originCashReceiptAmount)
        ) {
          return [
            {
              ...v,
              cashReceipt: Boolean(v.originCashReceiptAmount),
              amount: v.originAmount,
            },
            {
              ...v,
            },
          ];
        }

        // 수납액과 현금영수증 금액이 다른 경우 && 작게 수정하는 경우 쪼개서 수정
        if (
          v.originAmount !== v.originCashReceiptAmount &&
          v.originCashReceiptAmount > 0 &&
          v.originAmount - v.amount > v.originCashReceiptAmount
        ) {
          if (v.originAmount - v.amount > v.originCashReceiptAmount)
            return [
              {
                ...v,
                cashReceipt: true,
                amount: Math.max(
                  v.originAmount - v.originCashReceiptAmount,
                  v.amount
                ),
              },
              {
                ...v,
                cashReceipt: false,
                amount: v.amount + v.originCashReceiptAmount,
              },
            ];
        } else {
          // 현금영수증 해제 및 기존 수납액보다 작게 수정하는 경우
          let diffAmount = v.originAmount - v.amount;
          if (diffAmount > 0) {
            v.cashReceipt = Boolean(v.originCashReceiptAmount);
          }
          return v;
        }
      })
      .flat();
  };

  // 최종적으로는 다시 과세/비과세 합쳐서 내보내기
  // 중복 히스토리 데이터를 생성했을 경우를 대비해서 재합산
  const getResult = () => {
    return {
      payout: [
        ...mergeData([...spliceToReceipt(payoutList.vat)], false, true),
        ...mergeData([...spliceToReceipt(payoutList.vatFree)], false, true),
      ].map((v) => {
        return {
          amount: v.amount,
          cashReceipt: v.vatFree ? cashReceipt.vatFree : cashReceipt.vat,
          companyName: v.customCompanyName ?? v.companyName,
          method: v.method,
          vatFree: v.vatFree,
        };
      }),
    };
  };

  return {
    setInit,
    cashReceipt,
    originPayoutList,
    payoutList,
    refundList,
    cashReceiptAmount,
    updateReceipt,
    updatePayoutList,
    updateRefundList,
    deletePayoutList,
    getResult,
  };
};
