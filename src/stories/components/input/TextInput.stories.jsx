import { useState } from 'react';
import { TextInput } from '~/components/TextInput';
import { Label } from '~/components/Label';

export default {
  title: 'Component/Input/TextInput',
  component: TextInput,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  return (
    <Label text="고객명">
      <TextInput {...args} />
    </Label>
  );
};

export const Default = Template.bind();
Default.args = {
  placeholder: '이름을 입력하세요.',
  onReset: null,
};

const Template1 = (args) => {
  const [value, setValue] = useState('');
  return (
    <Label text="고객명">
      <TextInput
        {...args}
        value={value}
        onChange={setValue}
        onReset={() => setValue('')}
      />
    </Label>
  );
};

export const WithReset = Template1.bind();
WithReset.args = {
  placeholder: '이름을 입력하세요.',
};

const Template2 = (args) => {
  return (
    <Label text="키">
      <TextInput {...args} />
    </Label>
  );
};

export const EndAdornment = Template2.bind();
EndAdornment.args = {
  placeholder: '키를 입력하세요.',
  endAdornment: 'cm',
  onReset: null,
};

const Template3 = (args) => {
  const [value, setValue] = useState('');
  return (
    <Label text="주민등록번호">
      <TextInput
        {...args}
        value={value}
        onChange={(v) => {
          args.onChange(v.replace(/[^0-9]/g, ''));
          setValue(v.replace(/[^0-9]/g, ''));
        }}
      />
    </Label>
  );
};

export const OnlyNumber = Template3.bind();
OnlyNumber.args = {
  placeholder: '앞 6자리',
  onReset: null,
};
