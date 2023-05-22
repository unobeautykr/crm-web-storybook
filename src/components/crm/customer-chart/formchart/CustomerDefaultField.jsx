import PropTypes from 'prop-types';
import styled from 'styled-components';
import { translate } from '~/utils/filters';
import { withStyles } from 'tss-react/mui';
import { FormControlLabel, RadioGroup, Radio } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 8px;
`;

const Question = styled.p`
  font-size: 11px;
  margin-right: 20px;
`;

const RadioButton = withStyles(FormControlLabel, () => ({
  label: {
    fontSize: '11px',
  },
}));

const RadioIcon = withStyles(Radio, () => ({
  root: {
    padding: '0 4px',
    '& .MuiSvgIcon-root': { fontSize: '18px' },
  },
}));

const CustomerDefaultField = ({ name, value, onChange }) => {
  return (
    <Wrapper>
      <Question>{`${String(name.map((v) => `[${translate(v)}]`)).replaceAll(
        ',',
        ' '
      )}를 해당 고객의 담당으로 지정하시겠습니까?`}</Question>
      <RadioGroup
        row
        aria-label={`${name}_flag`}
        name={`${name}_flag`}
        value={String(value)}
        onChange={(e) => onChange(JSON.parse(e.target.value))}
      >
        <RadioButton
          value="true"
          label="예"
          control={<RadioIcon color="primary" />}
        />
        <RadioButton
          value="false"
          label="아니요"
          control={<RadioIcon color="primary" />}
        />
      </RadioGroup>
    </Wrapper>
  );
};

CustomerDefaultField.propTypes = {
  name: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default CustomerDefaultField;
