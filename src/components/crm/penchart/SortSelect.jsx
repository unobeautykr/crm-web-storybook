import PropTypes from 'prop-types';
import NativeSelect from '~/components/NativeSelect2';

const sortList = [
  {
    value: 'createdAt desc',
    label: '등록일 최신순',
  },
  {
    value: 'createdAt asc',
    label: '등록일 오래된순',
  },
  {
    value: 'name desc',
    label: '이름 오름차순',
  },
  {
    value: 'name asc',
    label: '이름 내림차순',
  },
  {
    value: 'updatedAt desc',
    label: '수정일 최신순',
  },
  {
    value: 'updatedAt asc',
    label: '수정일 오래된순',
  },
];

const SortSelect = ({ value, onChange }) => {
  return (
    <NativeSelect
      value={value}
      onChange={onChange}
      options={sortList}
      optionValue="value"
      optionLabel="label"
      isRequire
    />
  );
};

SortSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SortSelect;
