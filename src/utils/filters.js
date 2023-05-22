import moment from 'moment';
import translation from '~/store/translation';

const ENV_LOCALE = 'KR';

export const phoneNumberFormatHyphen = (phoneNumber) => {
  return (phoneNumber ?? '')
    .replace(/[^0-9]/g, '')
    .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, '$1-$2-$3')
    .replace('--', '-');
};

export const phoneNumberLastNumber = (phoneNumber) => {
  return phoneNumber ?? ''
    ? phoneNumber.substr(phoneNumber.length - 4, 4)
    : '-';
};

export const translate = (key, forcedLocale) => {
  const locale = forcedLocale || translation.locale || 'en';
  return (translation.texts[key] || {})[locale] || key;
};

export const formatDate = (value, format) => {
  if (!value) return;

  const timestamp = moment(value);
  const fallbackFormat = 'YYYY-MM-DD';
  const toKR = (result) => {
    result = result.replace(/AM/g, '오전');
    result = result.replace(/PM/g, '오후');
    result = result.replace(/am/g, '오전');
    result = result.replace(/pm/g, '오후');
    return result;
  };

  if (format) {
    return toKR(timestamp.format(format));
  }
  return toKR(timestamp.format(fallbackFormat));
};

export const asAge = (birthday) => {
  const m = (args) => moment(args);
  const thisYear = m().format('YYYY');
  const birthYear = m(birthday).format('YYYY');
  return thisYear - birthYear + 1;
};

export const ageText = (customer) => {
  return customer.age === null
    ? '-'
    : customer.age === 0
    ? `만 ${customer.ageMonth}개월`
    : `만 ${customer.age}세`;
};

export const currencySymbol = (countryCode) => {
  if (!countryCode) {
    countryCode = ENV_LOCALE;
  }
  switch (countryCode.toLowerCase()) {
    case 'kr':
      return '₩';
    case 'us':
      return '$';
    default:
      return '';
  }
};

export const currency = (value, decimalCount) => {
  const digitsRegex = /(\d{3})(?=\d)/g;
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return '';
  decimalCount = decimalCount || 0;
  const valueStr = Math.abs(value).toFixed(decimalCount);
  const integer = decimalCount
    ? valueStr.slice(0, -1 - decimalCount)
    : valueStr;
  const i = integer.length % 3;
  const head =
    i > 0 ? integer.slice(0, i) + (integer.length > 3 ? ',' : '') : '';
  const decimals = decimalCount ? valueStr.slice(-1 - decimalCount) : '';
  const sign = value < 0 ? '-' : '';
  return sign + head + integer.slice(i).replace(digitsRegex, '$1,') + decimals;
};

export const removeCurrency = (value) => {
  // 모든 , 를 '' 로 치환
  return Number(value.replace(/,/g, ''));
};

export const ipFront = (ip) => {
  if (!ip) {
    return;
  }
  return ip.split('.').slice(0, 2).join('.');
};

export const numArray = (len) => {
  let arr = [];
  for (let i = 0; i < len; i++) arr.push(i);
  return arr;
};

export const alphaNumeric = (s) => {
  return s.split('').every((c) => /^[a-zA-Z0-9가-힣]+$/.test(c));
};

export const $case = {
  toSnake: function (str, delim) {
    if (!str) return;

    let upperChars = str.match(/([A-Z])/g);
    if (!upperChars) {
      return str;
    }

    for (let i = 0, n = upperChars.length; i < n; i++) {
      str = str.replace(
        new RegExp(upperChars[i]),
        (delim || '_') + upperChars[i].toLowerCase()
      );
    }

    if (str.slice(0, 1) === (delim || '_')) {
      str = str.slice(1);
    }

    return str;
  },
  toConst: function (str, delim) {
    if (!str) return;

    return this.toSnake(str, delim).toUpperCase();
  },
  toPascal: function (str, delim, limit) {
    let splitted = str.split(delim || '_');
    if (limit) {
      splitted = splitted.slice(0, limit);
    }

    return splitted.reduce(
      (result, word) => (result += this.toCapital(word)),
      ''
    );
  },
  toCamel: function (str, delim) {
    const pascal = this.toPascal(str, delim);
    return pascal[0].toLowerCase() + pascal.substr(1);
  },
  toCapital: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

export const pluralize = (str) => {
  if (!str) return;

  if (str.toLowerCase().endsWith('s')) return str;
  if (str.toLowerCase().endsWith('y'))
    return str.substr(0, str.length - 1) + 'ies';
  return str + 's';
};

export const copy = (obj) => JSON.parse(JSON.stringify(obj));

export const fillTimeframe = (unit) =>
  numArray(60 / unit).map((t) =>
    (t * unit < 10 ? `0${t * unit}` : t * unit).toString()
  );

export const formatCallerNumber = (number, locale = ENV_LOCALE) => {
  number = String(number ? number : '');
  locale = locale.toUpperCase();

  const formatter = {
    KR: (num) => {
      // validation은 별도로 진행

      // 5자리부터 판단. 0101 -(+)-> 010-12
      if (num.length < 4) return num;

      // 휴대폰. 010-1234-5678, 018-123-1234, 011-1234-1234
      if (num.slice(0, 2) === '01')
        return num.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

      // 서울 지역의 경우. (02) 123-1234
      if (num.slice(0, 2) === '02')
        return num.replace(/(\d{2})(\d{3,4})(\d{4})/, '($1) $2-$3');

      // 지방 지역번호의 경우. (031) 1234-5678
      if (num.slice(0, 1) === '0')
        return num.replace(/(\d{3})(\d{3,4})(\d{4})/, '($1) $2-$3');

      // 1로 시작하는 번호. 1588-1234
      if (num.slice(0, 1) === '1')
        return num.replace(/(\d{4})(\d{4})/, '$1-$2');

      // 예측되지 못한 케이스는 그대로리턴
      return num;
    },
    US: (num) => {
      return num;
    },
    JP: (num) => {
      return num;
    },
  };

  return formatter[locale](number);
};

// convertCodeoLocaleToLang
// 지역에 대응하는 표준언어코드로 변환
export const convertCodeTranslationToLanguage = {
  kr: 'ko',
  en: 'en',
};
export const convertCodeTranslationToLocale = {
  kr: 'kr',
  en: 'us',
};

export const convertCodeTranslationToLanguageAndLocale = {
  kr: 'ko-KR',
  en: 'en-US',
};

export const toThousandCommas = (number) => {
  var regexp = /\B(?=(\d{3})+(?!\d))/g;
  return number !== undefined ? number.toString().replace(regexp, ',') : '';
};

export const emojisContainsCheck = (str) => {
  //텍스트에 특수이모티콘(이모지) 포함되어있는지 체크
  //이모지를 포함하고 있으면 true를 반환
  if (str !== '') {
    let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/;
    let unicode_regex = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
    // 이 정규식은 왼쪽에서 오른쪽으로 일치합니다.
    // 선택적 수정자가있는 그림 이모티콘 ( \p{Emoji_Modifier_Base}\p{Emoji_Modifier}?);
    // 기본적으로 텍스트가 아닌 이모티콘으로 렌더링되는 나머지 기호 ( \p{Emoji_Presentation});
    // 기본적으로 텍스트로 렌더링되지만 U + FE0F VARIATION SELECTOR-16 ( \p{Emoji}\uFE0F)을 사용하여 이모티콘으로 렌더링해야하는 기호입니다 .

    return unicode_regex.test(str) === true || regex.test(str) === true;
  } else {
    return false;
  }
};

export const toDayName = (d) => {
  const fixingWeek = ['일', '월', '화', '수', '목', '금', '토']; //getDay를 구하기 위함
  return fixingWeek[new Date(d).getDay()];
};

export const toDateString = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const payoutCards =
  //수납시 신용카드,체크카드 목록
  [
    '직불카드',
    'BC카드',
    'IBK기업카드',
    'KB국민카드',
    'NH농협카드',
    'SC제일은행카드',
    '삼성카드',
    '신한카드',
    '씨티카드',
    '외환카드',
    '우리카드',
    '롯데카드',
    '하나카드',
    '현대카드',
    '카카오뱅크카드',
    '케이뱅크카드',
    '전북은행카드',
    '제주은행카드',
    '경남은행카드',
    '광주은행카드',
    '대구은행카드',
    '부산은행카드',
    '산업은행카드',
    // '직접입력',
  ];

export const payoutBankTransfers = [
  //수납시 계좌이체 목록
  'IBK기업은행',
  'SC제일은행',
  '경남은행',
  '광주은행',
  '국민은행',
  '농협은행',
  '대구은행',
  '부산은행',
  '수협은행',
  '신한은행',
  '외환은행',
  '우리은행',
  '전북은행',
  '제주은행',
  '카카오뱅크',
  '케이뱅크',
  '하나은행',
  '한국산업은행',
  '한국수출입은행',
  '한국시티은행',
  // '직접입력',
];

export const convertArrayTo2D = (num, array) => {
  //1차원 배열을 2차원배열로 변경.. num 값으로 분할
  //[1,2,3,4] => [[1,2],[3,4]]
  var arr = array;
  var Arr = new Array(Math.ceil(arr.length / num));
  for (var i = 0; i < Arr.length; i++) {
    Arr[i] = [];
    for (var j = 0; j < num; j++) {
      Arr[i][j] = '';
    }
  }
  for (var idx = 0; idx < arr.length; idx++) {
    Arr[parseInt(idx / num)][idx % num] = arr[idx];
  }
  return Arr;
};

export const checkBirthdayFormat = (birthday) => {
  //6자리 패턴 ex)940505
  let pattern1 = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
  if (pattern1.test(birthday)) {
    return true;
  }
  //8자리 패턴 ex)19940505
  let pattern2 = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (pattern2.test(birthday)) {
    return true;
  }
  //8자리 -패턴 ex)1994-05-05
  let pattern3 = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (pattern3.test(birthday)) {
    return true;
  }
  return false;
};

export const checkPhoneNumberFormat = (phoneNumber) => {
  //4자리 ex)1234
  if (!isNaN(phoneNumber) && phoneNumber.length === 4) {
    return true;
  }

  //full ex)01012345678
  if (!isNaN(phoneNumber) && phoneNumber.length === 11) {
    return true;
  }
  return false;
};

export const checkEmailFormat = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const removeNotNumber = (value) => {
  return value.replace(/\D/g, '');
};
