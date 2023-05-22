import { useContext, useState } from 'react';
import styled from 'styled-components';
import { FindFamilyInput } from './FindFamilyInput';
import { CustomerInfoContext } from './CustomerAddChartInfo';
import { returnSex } from '~/components/crm/appointment-boards/FindCustomerAutoCompleteRow';
import { phoneNumberFormatHyphen } from '~/utils/filters';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px;
  row-gap: 8px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  width: 66%;
`;

const ListButton = styled.button`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  border-radius: 50% !important;
  margin: 0 8px;
  color: #fff;
  font-weight: bold;
`;

const AddButton = styled(ListButton)`
  background: #293142;
`;

const RemoveButton = styled(ListButton)`
  background: #eb5757;
`;

const returnText = (customer) => {
  let { name, birthday, phoneNumber } = customer;
  if (birthday) birthday = birthday.replace(/-/g, '.');
  if (phoneNumber) phoneNumber = phoneNumberFormatHyphen(phoneNumber);

  return `${name ?? '-'}/${birthday ?? '-'}/${returnSex(customer.sex) ?? '-'}/${
    phoneNumber ?? '-'
  }`;
};

const FamilyInfo = () => {
  const { obj, setObj, disableForm } = useContext(CustomerInfoContext);
  const [items, setItems] = useState(
    obj.familyRelationships && obj.familyRelationships.length > 0
      ? obj.familyRelationships.map((v) => ({ ...v, name: returnText(v) }))
      : [{ name: '', id: '' }]
  );
  const addList = () => {
    let update = [...items];
    update.push({ name: '', id: '' });
    if (items.length === 0) {
      update.push({ name: '', id: '' });
    }
    setItems([...update]);
  };
  const removeList = (i) => {
    let update = [...items];
    update.splice(i, 1);
    setItems([...update]);
    setObj({ ...obj, familyRelationships: update });
  };

  return (
    <Wrapper>
      <label>가족관계</label>
      {items.map((v, i) => (
        <FlexWrapper key={i}>
          <InputWrapper>
            <FindFamilyInput
              index={i}
              items={items}
              setItems={setItems}
              obj={obj}
              setObj={setObj}
              disabled={disableForm}
            />
          </InputWrapper>
          {!disableForm &&
            (items.length === 0 || items.length - 1 === i ? (
              <AddButton onClick={addList}>+</AddButton>
            ) : (
              <RemoveButton onClick={() => removeList(i)}>-</RemoveButton>
            ))}
        </FlexWrapper>
      ))}
    </Wrapper>
  );
};

export default FamilyInfo;
