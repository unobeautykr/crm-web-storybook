import styled from 'styled-components';
import { Tooltip } from '~/components/Tooltip';

export default {
  title: 'Component/Tooltip/Default',
  component: Tooltip,
  parameters: {
    element: true,
  },
};

const Div = styled.div`
  width: 50px;
`;

const Template = (args) => {
  return <Tooltip {...args} />;
};

export const Default = Template.bind();
Default.args = {
  title: '툴팁 내용입니다.',
  children: <Div>Tooltip</Div>,
  open: true,
};
