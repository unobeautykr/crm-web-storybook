import { AutoCompleteSelect } from '~/components/AutoCompleteSelect';

export default {
  title: 'Component/Input/AutoCompleteSelect',
  component: AutoCompleteSelect,
  parameters: {
    element: true,
  },
};

const Template = (args) => <AutoCompleteSelect {...args} />;
export const Default = Template.bind();
Default.args = {
  disableClearable: true,
  placeholder: '옵션을 선택하세요.',
  options: [
    { id: 1, name: '옵션1' },
    { id: 2, name: '옵션2' },
  ],
  defaultOptions: [
    {
      name: '기본옵션',
      style: { color: '#BBBBBB' },
      onClick: () => alert('기본옵션'),
    },
  ],
};
