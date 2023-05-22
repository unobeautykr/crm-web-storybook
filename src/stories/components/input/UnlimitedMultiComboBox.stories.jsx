import { useState } from 'react';
import styled from 'styled-components';
import { UnlimitedMultiComboBox } from '~/components/UnlimitedMultiComboBox';

const LabelText = styled.div`
  font-size: 12px;
  width: 64px;
  padding-left: 5px;
  word-break: keep-all;
  line-height: 1;
`;

export default {
  title: 'Component/Input/UnlimitedMultiComboBox',
  component: UnlimitedMultiComboBox,
  parameters: {
    element: true,
  },
};

const testData = [
  { id: 1, label: '첫번째' },
  { id: 2, label: '두번째' },
  { id: 3, label: '세번째' },
  { id: 4, label: '네번째' },
  { id: 5, label: '다섯번째' },
];

const Template = () => {
  const [value, setValue] = useState([]);

  return (
    <UnlimitedMultiComboBox
      options={testData}
      value={value}
      onChange={setValue}
      placeholder="placeholder"
      size="medium"
    />
  );
};
export const Default = Template.bind();

const SearchFiliterTemplate = () => {
  const [value, setValue] = useState([]);

  return (
    <UnlimitedMultiComboBox
      variant="search"
      startAdornment={<LabelText>Title</LabelText>}
      options={testData}
      value={value}
      onChange={(v) => {
        setValue(v);
      }}
      placeholder="placeholder"
      size="large"
    />
  );
};

export const SearchFilter = SearchFiliterTemplate.bind();
