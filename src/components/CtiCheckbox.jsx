import './ctiCheckbox.scss';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export const CtiCheckbox = ({ id = uuidv4(), className, ...props }) => {
  return (
    <div className={`cti-checkbox-wrapper ${className}`}>
      <input type="checkbox" className="cti-checkbox" id={id} {...props} />
      <label htmlFor={id}></label>
    </div>
  );
};

CtiCheckbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
};
