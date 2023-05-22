import { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '~/components/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const InputEndAdornment = styled(InputAdornment)`
  p {
    font-size: 12px;
    margin-right: 8px;
  }
`;

export default {
  title: 'Component/Input/TextField',
  component: TextField,
  parameters: {
    element: true,
  },
};

const Template = () => {
  const [value, setValue] = useState('');

  return (
    <TextField placeholder="placeholder" value={value} onChange={setValue} />
  );
};
export const Default = Template.bind();

const EndAdornmentTemplate = () => {
  const [value, setValue] = useState('');

  return (
    <TextField
      placeholder="몸무게를 입력하세요"
      value={value}
      onChange={setValue}
      endAdornment={<InputEndAdornment position="end">kg</InputEndAdornment>}
    />
  );
};
export const EndAdornment = EndAdornmentTemplate.bind();

const SearchFilterTemplate = () => {
  const [value, setValue] = useState('');

  return (
    <TextField
      type="search"
      startAdornment="전화번호"
      placeholder="전화번호 뒤 4자리"
      value={value}
      onChange={setValue}
    />
  );
};
export const SearchFilter = SearchFilterTemplate.bind();
