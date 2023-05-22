import styled from 'styled-components';
import { Tooltip } from '~/components/Tooltip';
import { ContentsTooltip } from '~/components/ContentsTooltip';

export default {
  title: 'Component/Tooltip',
  component: Tooltip,
  parameters: {
    element: true,
  },
};

const Div = styled.div`
  width: 50px;
`;

const Template2 = (args) => {
  return <ContentsTooltip {...args} />;
};

export const Contents = Template2.bind();
Contents.args = {
  arrow: true,
  title: (
    <>
      <div>툴팁내용입니다.</div>
      <div>툴팁내용입니다.</div>
      <div>툴팁내용입니다.</div>
      <div>툴팁내용입니다.</div>
      <div>툴팁내용입니다.</div>
      <div>툴팁내용입니다.</div>
    </>
  ),
  children: <Div>Tooltip</Div>,
  placement: 'right',
};
