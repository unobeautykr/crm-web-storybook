import { Button } from '~/components/Button';

export default {
  title: 'Component/Button/Button',
  component: Button,
  parameters: {
    element: true,
  },
};

const Template = (args) => <Button {...args} />;
export const Fill = Template.bind();
Fill.args = {
  color: 'primary',
  styled: 'fill',
  size: 'm',
  disabled: false,
  children: '버튼명',
};

export const Outline = Template.bind();
Outline.args = {
  color: 'primary',
  styled: 'outline',
  size: 'm',
  disabled: false,
  children: '버튼명',
};
