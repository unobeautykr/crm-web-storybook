import PropTypes from 'prop-types';
import { translate } from '~/utils/filters';
import { observer } from 'mobx-react';

const ModalBasic = ({ options, close }) => {
  const onClickButton = (button) => {
    close();
    if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <div className="modal-basic">
      {(options.title || options.showCloseButton) && (
        <div className="head flex-row flex-between items-start">
          <div className={`title ${options.titleClass || ''}`}>
            {translate(options.title)}
          </div>
          {options.showCloseButton ? (
            <i onClick={() => close()} className="zmdi zmdi-close" />
          ) : null}
        </div>
      )}
      <div
        className={`body pre-line ${options.bodyClass}`}
        dangerouslySetInnerHTML={{ __html: options.body }}
      />
      {options.markup && (
        <div className={`body pre-line ${options.bodyClass}`}>
          {options.markup}
        </div>
      )}
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

ModalBasic.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(ModalBasic);
