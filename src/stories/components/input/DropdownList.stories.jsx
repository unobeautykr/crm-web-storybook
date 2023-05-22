import { useState } from 'react';
import styled from 'styled-components';
import { DropdownList } from '~/components/DropdownList';

const LabelText = styled.div`
  font-size: 12px;
  width: 64px;
  padding-left: 5px;
  word-break: keep-all;
  line-height: 1;
`;

export default {
  title: 'Component/Input/DropdownList',
  component: DropdownList,
  parameters: {
    element: true,
  },
};

const testData = [
  { id: 1, label: '신환' },
  { id: 2, label: '구환' },
];

const Template = () => {
  const [value, setValue] = useState();

  return (
    <DropdownList
      options={testData}
      value={value}
      onChange={setValue}
      placeholder="placeholder"
    />
  );
};
export const Default = Template.bind();

const SearchFilterTemplate = () => {
  const [value, setValue] = useState();

  return (
    <DropdownList
      variant="search"
      startAdornment={<LabelText>신/구환</LabelText>}
      options={testData}
      value={value}
      onChange={setValue}
      placeholder="신/구환"
    />
  );
};
export const SearchFilter = SearchFilterTemplate.bind();
