import { unusedCode } from '~/utils/unusedCodeUtil';

export const getOptions = (data, value) => {
  let options = [...data];

  if (!value || !value.id) return options;

  if (
    (value.status === 'inactive' || value.visible === false) &&
    !options.find((f) => f.id === value.id)
  ) {
    return [
      {
        ...value,
        name: unusedCode.getNameByUnusedValue({ ...value, visible: false }),
      },
      ...options,
    ];
  } else if (
    (value.status === 'deleted' ||
      value?.isDeleted === true ||
      value?.deletedAt !== null) &&
    !options.find((f) => f.id === value.id)
  ) {
    return [
      {
        ...value,
        name: unusedCode.getNameByUnusedValue({ ...value, isDeleted: true }),
      },
      ...options,
    ];
  }
  return options;
};

export const isConfirmInactiveValue = (
  originFormData,
  connectRegistration,
  value
) => {
  return (
    !originFormData &&
    (connectRegistration[value] === null ||
      connectRegistration[value]?.status === 'inactive' ||
      connectRegistration[value]?.status === 'deleted')
  );
};
