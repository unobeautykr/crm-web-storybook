import styled from 'styled-components';
import { useChartCard } from '~/hooks/useChartCard';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CategoryRow = styled.div`
  display: flex;
`;

const CategoryName = styled.div`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::before {
    content: '[';
  }
  &::after {
    content: ']';
  }
`;

export const SurgeryCategoriesNames = ({ item }) => {
  const { getCardValue, getCardType } = useChartCard();

  const getCategories = (item) => {
    let categories = [];
    const { category, treatmentItems } = item;
    if (category === 'NONE') {
      const cardType = getCardType(item);
      const cardValue = getCardValue(item);
      switch (cardType) {
        case 'SURGERY':
        case 'SKINCARE':
          {
            cardValue.map((card) => {
              if (card.ticketUses.length > 0) {
                card.ticketUses.forEach((v) => {
                  categories.push({
                    categoryName: v.ticket.treatmentItem.category.name,
                    name: v.ticket.treatmentItem.name,
                    count: v.count,
                  });
                });
              }
            });
          }
          break;
        case 'PAYMENT':
          {
            cardValue.map((card) => {
              if (card.productItems?.length > 0) {
                card.productItems.forEach((v) => {
                  categories.push({
                    name: v.product.name,
                    count: v.quantity,
                  });
                });
              }
              if (card.tickets?.length > 0) {
                card.tickets.forEach((v) => {
                  categories.push({
                    categoryName: v.treatmentItem.category.name,
                    name: v.treatmentItem.name,
                    count: v.treatmentCount,
                  });
                });
              }
            });
          }
          break;
      }
    } else {
      //예약 or 접수
      if (treatmentItems?.length > 0) {
        treatmentItems.forEach((v) => {
          categories.push({
            categoryName: v.category.name,
            name: v.name,
          });
        });
      }
    }

    return categories;
  };

  let categories = getCategories(item);

  return categories.map((v, i) => {
    return (
      <Wrapper key={i}>
        <CategoryRow>
          {v.categoryName && (
            <>
              <CategoryName>{v.categoryName}</CategoryName>
              <span> - </span>
            </>
          )}
          <CategoryName>{v.name}</CategoryName>
        </CategoryRow>
        {v.count && <div>{v.count}</div>}
      </Wrapper>
    );
  });
};
