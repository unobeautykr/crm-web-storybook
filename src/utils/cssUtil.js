export const HideScrollStyle = `
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`;

export const flexGapHor = (margin) => {
  return `
    & > * {
      margin: 0px ${margin}px;

      &:first-child {
        margin-left: 0px;
      }
      &:last-child {
        margin-right: 0px;
      }
    }
  `;
};

export const flexGapVer = (margin) => {
  return `
    & > * {
      margin: ${margin}px 0px;

      &:first-child {
        margin-top: 0px;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  `;
};
