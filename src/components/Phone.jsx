import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { translate } from '~/utils/filters';
import { TextField } from '~/components/TextField';

const Phone = ({
  phone,
  onChange,
  className,
  placeholder,
  tabIndex,
  disabled,
  border = false,
}) => {
  const snackbar = useSnackbarContext();

  const onChangePhone = (value, event) => {
    event.preventDefault();

    if (!/^[0-9-]*$/.test(value)) {
      snackbar.alert(translate('ERROR_NUMBERS_ONLY'));
      return;
    }

    if (value.length > 13) {
      snackbar.alert(translate('ERROR_PHONE_TOO_LONG'));
      return;
    }

    let numberTemp = (value || '')
      .replace(/[^0-9]/g, '')
      .replace(
        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,
        '$1-$2-$3'
      )
      .replace('--', '-');
    onChange(numberTemp);
  };

  return (
    <div className={`phone ${className}`}>
      <TextField
        tabIndex={tabIndex}
        value={(phone || '')
          .replace(/[^0-9]/g, '')
          .replace(
            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,
            '$1-$2-$3'
          )
          .replace('--', '-')}
        onChange={onChangePhone}
        placeholder={placeholder}
        disabled={disabled}
        border={border}
      />
    </div>
  );
};

Phone.propTypes = {
  phone: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
};

export default observer(Phone);
