import { useState } from 'react';
import styled from 'styled-components';
import { Chip } from '~/components/Chip';

export default {
  title: 'Component/Button/Chip',
  component: Chip,
  parameters: {
    element: true,
  },
};

const Chips = styled.div(
  ({ theme }) => `
  border: solid 1px ${theme.palette.bluegrey[500]};
  border-radius: 4px;
  max-width: 798px;
  min-height: 74px;
  display: flex;
  padding: 10px 16px 10px 16px;
  margin-top: 10px;
`
);

const Template = () => {
  const [chips, setChips] = useState(['첫번째', '두번째', '세번째']);

  return (
    <Chips>
      {chips.map((v, i) => (
        <Chip
          key={i}
          disabled={i === 0}
          value={v}
          onDelete={() => {
            setChips(chips.filter((f) => f !== v));
          }}
        />
      ))}
    </Chips>
  );
};
export const Default = Template.bind();
