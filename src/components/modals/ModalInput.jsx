import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { translate } from '~/utils/filters';
import { observer } from 'mobx-react';
import { styled } from '@mui/material/styles';

const Input = styled('input')`
  min-width: 100%;
  width: calc(100% - 85px);
  background-color: #fff;
  font-size: 14px;
  height: 34px;
  padding: 8px 20px;
  border-radius: 4px;
  border: 1px solid #dee2ec;
`;

const ModalInput = ({ options, close }) => {
  const me = useRef();

  useEffect(() => {
    const inputs = me.current.getElementsByTagName('input');
    if (!inputs) return;

    inputs[0].focus();
  }, []);

  const onClickSave = () => {
    close();
    if (options.onClickSave) {
      options.onClickSave(options.inputs);
    }
  };

  return (
    <div className="modal-input" ref={me}>
      <div className="head flex-row flex-between items-start">
        <div className={`title ${options.titleClass || ''}`}>
          {translate(options.title)}
        </div>
        {options.showCloseButton ? (
          <i onClick={() => close()} className="zmdi zmdi-close" />
        ) : null}
      </div>
      <div
        className={`body pre-line ${options.bodyClass}`}
        dangerouslySetInnerHTML={{ __html: options.body }}
      />
      {options.inputs ? (
        <div className="inputs">
          {options.inputs.map((input, idx) => (
            <div className="form-control" key={idx}>
              <label
                dangerouslySetInnerHTML={{
                  __html: translate(input.label),
                }}
              />
              <Input
                value={input.text ? input.text : ''}
                onChange={(e) => (input.text = e.target.value)}
                placeholder={translate(input.placeholder)}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="buttons">
        <div className="flex-row">
          <button onClick={() => close()} className="btn btn-default">
            {translate('CANCEL')}
          </button>
          <button onClick={() => onClickSave()} className="btn btn-primary">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

ModalInput.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(ModalInput);
