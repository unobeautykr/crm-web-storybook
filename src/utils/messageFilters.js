export const convertManualNumbers = (str) => {
  // v4. 에러케이스와 중복된 경우를 동시 충족할 경우 에러케이스만 노출
  // v3. UI상 노출순 변경 : 중복-상단/오류-하단
  // v2. - 도 허용하지 않게, 모호하게 우회되는케이스 발생 case: 010-123-1234, 0101231234

  const _uniqueNumbers = [];
  const splited = str ? str.split(',').filter((v) => v.length !== 0) : [];
  const numbers = splited.map((number) => {
    const numRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})(\d{4})$/;
    let isError = true;
    let isDuplicated = false;
    number = number.trim();

    // if ( number.match("^01(?:0|1|[6-9])[-]?(\\d{3}|\\d{4})[-]?(\\d{4})$") ){
    if (_uniqueNumbers.indexOf(number) === -1) {
      isError = !numRegex.test(number);
      // if( numRegex.test(number) ){
      // isError = false
      // number = number.replace(/-/g, "")
      // }
    } else {
      isDuplicated = true;
    }
    _uniqueNumbers.push(number);

    // if( _uniqueNumbers.indexOf(number)>-1 ){
    // isDuplicated = true
    // }else{
    // _uniqueNumbers.push( number )
    // }
    return {
      number: number,
      isError: isError,
      isDuplicated: isDuplicated,
    };
  });

  return {
    total: {
      success: numbers.filter((n) => !n.isError && !n.isDuplicated).length,
      duplicate: numbers.filter((n) => n.isDuplicated).length,
      error: numbers.filter((n) => n.isError && !n.isDuplicated).length,
    },
    data: {
      success: numbers
        .filter((n) => !n.isError && !n.isDuplicated)
        .map((n) => n.number),
      duplicate: numbers.filter((n) => n.isDuplicated).map((n) => n.number),
      error: numbers
        .filter((n) => n.isError && !n.isDuplicated)
        .map((n) => n.number),
    },
  };
};

const _convertTargetGroup = () => {
  const dynamicConditions = [
    'customer',
    'appointment',
    'consulting',
    'treatment',
    'payment',
  ];
  const dynamicConditionsUiKeyName = 'conditions';
  const serverToUi = (serverObj) => {
    const dynamicUiObj = dynamicConditions.flatMap((category) => {
      const childConditions = Object.keys(
        Object.prototype.hasOwnProperty.call(serverObj, category) &&
          serverObj[category]
          ? serverObj[category]
          : []
      );

      return childConditions
        .map((column) => {
          if (!serverObj[category][column]) {
            return false;
          }

          return {
            ...serverObj[category][column],
            category: category,
            item: column,
            uiKeyName: `${category}.${column}`,
          };
        })
        .filter((obj) => obj !== false);
    });
    return {
      // ...staticUiObj,
      [dynamicConditionsUiKeyName]: dynamicUiObj,
    };
  };

  const uiToServer = (uiObj) => {
    const resultObj = {};
    uiObj[dynamicConditionsUiKeyName].forEach((row) => {
      if (row.uiKeyName !== null) {
        if (row.uiKeyName.indexOf('.')) {
          const category = row.category;
          const item = row.item;
          if (!Object.prototype.hasOwnProperty.call(resultObj, category)) {
            resultObj[category] = {};
          }
          resultObj[category][item] = {
            query: row.query,
            ...(Object.prototype.hasOwnProperty.call(row, 'include') && {
              include: row.include,
            }),
          };
        }
      }
    });
    return resultObj;
  };
  return {
    serverToUi: serverToUi,
    uiToServer: uiToServer,
  };
};

export const targetConditionConverter = _convertTargetGroup();
