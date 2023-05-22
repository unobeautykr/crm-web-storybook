import { library } from '@fortawesome/fontawesome-svg-core';

/*
 NOTE :
  1. App.js에서 참조됩니다.
  2. 빈번하게 사용되는 아이콘을 library.add를 통해 추가 
  3. 사용 빈도가 낮은 아이콘은 해당 컴포넌트에서 직접 호출
   - 사용하지 않는 아이콘은 번들링되지 않습니다.
*/

import {
  faCircleNotch,
  faSpinner,
  faCheck,
  faExternalLinkAlt,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

const iconConfig = () => {
  /*
      참고문서: https://fontawesome.com/icons?m=free
  */

  library.add(faCircleNotch, faSpinner, faCheck, faExternalLinkAlt, faBan);
};

export { iconConfig };
