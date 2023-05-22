import { styled, css } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { phoneNumberFormatHyphen } from '~/utils/filters';

const Wrapper = styled('div')`
  font-size: 12px;
  & > div {
    width: 100%;
  }
`;

const Row = styled('div')`
  overflow: scroll;
  padding: 0 !important;
  display: table !important;
`;

const Column = styled('div')`
  text-align: center;
  display: table-cell;
  vertical-align: middle;
`;

const ColumnValue = styled('div')(
  ({ width }) => `
  margin: 5px;
  width: ${width}px;
`
);

export const returnSex = (sex) => {
  switch (sex) {
    case 'male':
      return '남성';
    case 'female':
      return '여성';
  }
};

export const FindCustomerAutoCompleteRow = ({ props, option }) => {
  return (
    <Wrapper {...props}>
      <Row>
        <Column>
          <ColumnValue width={60}>{option.name}</ColumnValue>
        </Column>
        <Column>
          <ColumnValue width={100}>{option.birthday}</ColumnValue>
        </Column>
        <Column>
          <ColumnValue width={50}>{returnSex(option.sex)}</ColumnValue>
        </Column>
        <Column>
          <ColumnValue width={100}>
            {phoneNumberFormatHyphen(option.phoneNumber)}
          </ColumnValue>
        </Column>
      </Row>
    </Wrapper>
  );
};

FindCustomerAutoCompleteRow.propTypes = {
  props: PropTypes.object,
  option: PropTypes.object,
};
