import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { translate } from '~/utils/filters';

const ModalSlot = ({ options, close }) => {
  const onClickButton = (button) => {
    close();
    if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <div className="modal-slot modal-consulting-evnt">
      <div className="head flex-row flex-between items-start">
        <div className={`title ${options.titleClass || ''}`}>
          {translate(options.title)}
        </div>
        {options.showCloseButton ? (
          <i onClick={() => close()} className="zmdi zmdi-close" />
        ) : null}
      </div>
      {/* preparedDom must be a function that returns a DOM */}
      {options.preparedDom ? options.preparedDom() : null}
      {options.buttons ? (
        <div className="buttons">
          <div className="flex-row">
            {options.buttons.map((button, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => onClickButton(button)}
                  className={button.class}
                >
                  {translate(button.text)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

ModalSlot.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(ModalSlot);
