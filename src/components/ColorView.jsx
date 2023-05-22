import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')(
  (props) => `
  position: relative;
  width: 150px;
  height: 180px;
  border: 1px solid #e6e6e6;
  background: ${props.color ? props.color : 'blue'};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  flex: 0 0 auto;
  &:hover {
    transform: translate3d(0, -3px, 0);
  }
`
);

export const Label = styled('div')`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  position: absolute;
  box-sizing: border-box;
  bottom: 0;
  padding: 14px;
  background: #fff;
  width: 100%;
`;

export const Name = styled('div')`
  color: #000;
  font-weight: bold;
  font-size: 16px;
  line-height: 1.2;
`;

export const Code = styled('div')`
  color: #4a4e70;
  font-size: 13px;
`;

export const ColorView = (props) => (
  <Wrapper {...props}>
    <Label>
      <Name>{props.name}</Name>
      <Code>{props.color}</Code>
    </Label>
  </Wrapper>
);

ColorView.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
};
