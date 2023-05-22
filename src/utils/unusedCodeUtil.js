export const unusedCode = {
  unusedCodeValue: '[미사용]',
  deletedCodeValue: '[삭제]',

  getNameByUnusedValue: (item) => {
    const { name, visible, isDeleted, deletedAt } = item;
    if (isDeleted === true || deletedAt) {
      return (
        unusedCode.deletedCodeValue +
        item.name.replace(unusedCode.deletedCodeValue, '')
      );
    }
    if (visible === false && !name.includes(unusedCode.unusedCodeValue)) {
      return unusedCode.unusedCodeValue + item.name;
    }
    return item.name;
  },
};
