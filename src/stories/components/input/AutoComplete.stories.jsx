import { AutoComplete } from '~/components/AutoComplete';
import { FindCustomerAutoCompleteRow } from '~/components/crm/appointment-boards/FindCustomerAutoCompleteRow';

export default {
  title: 'Component/Input/AutoCompleteSelect',
  component: AutoComplete,
  parameters: {
    element: true,
  },
};

const Template = (args) => (
  <AutoComplete
    {...args}
    renderOption={(props, option) => (
      <FindCustomerAutoCompleteRow props={props} option={option} {...props} />
    )}
  />
);

export const Autocomplete = Template.bind();
Autocomplete.args = {
  placeholder: '고객을 선택하세요.',
  options: [
    {
      id: 1,
      name: '이나혜1',
      sex: 'female',
      birthday: '1994-05-05',
      phoneNumber: '01012345667',
      searchOption: '이나혜1/5667',
    },
    {
      id: 2,
      name: '이나혜2',
      sex: 'male',
      birthday: '1994-05-06',
      phoneNumber: '01012345668',
      searchOption: '이나혜2/5668',
    },
    {
      id: 3,
      name: '이나혜3',
      sex: 'female',
      birthday: '1994-05-07',
      phoneNumber: '01012345669',
      searchOption: '이나혜3/5669',
    },
  ],
};
