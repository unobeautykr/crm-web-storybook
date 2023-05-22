import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { numArray } from '~/utils/filters';
import PropTypes from 'prop-types';

const ModalImages = ({ options, close }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const chevronLeft = () => (currentIndex <= 0 ? 'o-0' : 'cursor-pointer');

  const chevronRight = () =>
    currentIndex >= options.images.length - 1 ? 'o-0' : 'cursor-pointer';

  const pageArray = numArray(options.images.length);

  const applyCustomStyle = useCallback(() => {
    setTimeout(() => {
      if (!options.style) return;

      let modalImages = document.getElementsByClassName('modal-images')[0];
      if (!modalImages) return;

      let image = document.getElementsByClassName('image')[0];

      Object.keys(options.style).forEach((key) => {
        image.style[key] = options.style[key];
      });
    });
  }, [options.style]);

  const openInNewTabOrClose = (imageUrl) => {
    if (options.openTab) {
      window.open(imageUrl, '_blank');
      return;
    }

    close();
  };

  const onClickLeft = useCallback(
    (e) => {
      if (e) e.stopPropagation();

      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        applyCustomStyle();
      }
    },
    [currentIndex, setCurrentIndex, applyCustomStyle]
  );

  const onClickRight = useCallback(
    (e) => {
      if (e) e.stopPropagation();

      if (currentIndex < options.images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        applyCustomStyle();
      }
    },
    [currentIndex, setCurrentIndex, applyCustomStyle, options.images.length]
  );

  const onKeydown = useCallback(
    (e) => {
      e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onClickLeft();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onClickRight();
    },
    [onClickLeft, onClickRight]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeydown);
    if (options.selectedIndex >= 0) {
      setCurrentIndex(options.selectedIndex);
    }

    if (options.style) applyCustomStyle();

    return () => window.removeEventListener('keydown', onKeydown);
  }, [
    currentIndex,
    applyCustomStyle,
    onKeydown,
    options.selectedIndex,
    options.style,
  ]);

  return (
    <div className="modal-images">
      <div className="flex-row" onClick={() => close()}>
        <div className="flex-wrap center">
          <i
            onClick={(e) => onClickLeft(e)}
            className={`zmdi zmdi-chevron-left ${chevronLeft()}`}
          />
        </div>
        <div
          onClick={() => openInNewTabOrClose(options.images[currentIndex])}
          className="image"
        >
          <img src={options.images[currentIndex]} alt="" />
        </div>
        <div className="flex-wrap center">
          <i
            onClick={(e) => onClickRight(e)}
            className={`zmdi zmdi-chevron-right ${chevronRight()}`}
          />
        </div>
      </div>
      <div className="index flex-row">
        {(pageArray || []).map((_, idx) => (
          <div
            className={`item flex-wrap ${
              currentIndex === idx ? 'selected' : ''
            }`}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

ModalImages.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(ModalImages);
