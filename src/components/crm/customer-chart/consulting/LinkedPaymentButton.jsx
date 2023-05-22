import { useContext } from 'react';
import { Button } from '~/components/Button';
import PropTypes from 'prop-types';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { TabType } from '~/core/TabUtil';
import { ChartType } from '~/core/chartType';

async function getOptions(chartType, chartId) {
  switch (chartType) {
    case ChartType.APPOINTMENT:
      return getAppointmentOptions(chartId);
    case ChartType.CONSULTING:
      return getConsultingOptions(chartId);
    case ChartType.TREATMENT:
      return getTreatmentOptions(chartId);
  }
}

export function LinkedPaymentButton({
  payment,
  chartId,
  registration,
  chartType,
}) {
  const { openForm } = useContext(CustomerChartContext);

  async function onClickCreate() {
    const options = await getOptions(chartType, chartId);

    openForm(
      Object.assign(
        {
          type: TabType.payment,
          sourceChartId: chartId,
          queued: true,
          registration,
        },
        options
      )
    );
  }

  if (!payment) {
    return (
      <Button
        disabled={registration.status === 'NONE'}
        onClick={onClickCreate}
        styled="outline"
        size="s"
      >
        수납생성
      </Button>
    );
  }

  return '생성완료';
}

LinkedPaymentButton.propTypes = {
  payment: PropTypes.object,
  registration: PropTypes.object,
  chartId: PropTypes.number,
  chartType: PropTypes.string,
};
