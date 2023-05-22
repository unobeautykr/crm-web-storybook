import classNames from 'classnames';
import PropTypes from 'prop-types';
import { createElement, forwardRef } from 'react';

function getSizeClass(fontSize) {
  switch (fontSize) {
    case 'xs':
      return 'CrmIcons-xs';

    case 'small':
      return 'CrmIcons-small';

    case 'normal':
      return 'CrmIcons-normal';

    case 'big':
      return 'CrmIcons-big';
  }
}

export const toIconComponent = (icon) => {
  const IconComponent = forwardRef(({ fontSize }, ref) => {
    return createElement(icon, {
      className: classNames('CrmIcons-root', getSizeClass(fontSize)),
      ref: ref,
    });
  });

  IconComponent.defaultProps = {
    fontSize: 'normal',
  };

  IconComponent.propTypes = {
    fontSize: PropTypes.oneOf(['xs', 'small', 'normal', 'big']),
  };

  return IconComponent;
};
