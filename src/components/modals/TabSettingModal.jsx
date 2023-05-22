import { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from 'tss-react/mui';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as VerticalDragArrow } from '~/assets/images/icon/vertical-drag-arrow.svg';
import { ReactComponent as Pinned } from '@ic/pinned.svg';
import { useToast } from '~/hooks/useToast';
import { useCustomerChart } from '~/hooks/useCustomerChart';

import Layout, { FooterButton } from './Layout';
import Button from '~/components/Button2';
import { FormControlLabel, Checkbox, Box } from '@mui/material';
import hooks from '~/hooks';

import { TabType, DefaultTabSetting } from '~/core/TabUtil';
import update from 'immutability-helper';

import { ReactComponent as Reset } from '@ic/ic-reset.svg';
import { Switch } from '~/components/Switch';
import { useApi } from '~/components/providers/ApiProvider';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';

const Body = styled.div`
  padding: 16px;
  font-size: 12px;
`;

const TitleText = styled.div`
  display: flex;
  align-items: center;
`;

const TitleButtons = styled.div`
  display: flex;
  margin: 10px 0;

  span {
    cursor: pointer;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #dee2ec;
  border-radius: 4px;
`;

const ItemBox = styled.div`
  display: flex;
  padding-bottom: 5px;
  justify-content: space-between;
  align-items: center;
`;

const Item = styled.div`
  width: 100%;
  height: 29px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  &:hover {
    background-color: #edeff1;
  }
`;

const CheckboxButton = withStyles(FormControlLabel, () => ({
  root: {
    marginLeft: '0px',
    padding: 0,
    color: (props) => props.color,
    marginRight: '5px',
  },
  label: {
    fontSize: 'inherit',
    lineHeight: '1',
  },
}));

const CheckboxIcon = withStyles(Checkbox, () => ({
  root: {
    marginLeft: '0px',
    marginRight: '2px',
    padding: 0,
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
    },
  },
}));

const PinnedIcon = styled(Pinned)`
  width: 10px;
  height: 10px;
  margin-right: 5px;

  path {
    fill: #2c62f6;
    stroke: #2c62f6;
  }
`;

const HoverPinnedIcon = styled(PinnedIcon)`
  cursor: pointer;

  ${({ $show }) =>
    $show
      ? css`
          display: initial;
        `
      : css`
          display: none !important;
        `}

  ${({ $pinned }) =>
    !$pinned &&
    css`
      display: none;

      path {
        fill: #a1b1ca;
        stroke: #a1b1ca;
      }
      ${Item}:hover & {
        display: initial;
      }
    `}
`;

const HoverVerticalDragArrow = styled(VerticalDragArrow)`
  display: none;

  ${Item}:hover & {
    display: initial;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;

  svg {
    margin-right: 3px;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  width: 100%;
  background: #dee2ec;
  border: 0;
  height: 1px;
`;

const TabSettingModal = ({ close }) => {
  const chartStore = useCustomerChart();
  const toast = useToast();
  const dataEvent = useDataEvent();

  const { userApi } = useApi();

  const [tabSetting, setTabSetting] = useState(
    chartStore.tabSetting ?? DefaultTabSetting
  );
  const [openFormSetting, setOpenFormSetting] = useState(
    chartStore.openFormSetting
  );

  const onClickReset = () => {
    setTabSetting(chartStore.tabSetting);
  };

  const onClickAllSelect = () => {
    setTabSetting(
      hooks.convertArrayToObject(
        Object.keys(tabSetting).map((v) => {
          return { key: v, value: { ...tabSetting[v], visible: true } };
        }),
        'key'
      )
    );
  };

  const onChangeChecked = (key, value) => {
    if (value.pinned) {
      toast.error('핀 고정 메뉴는 숨김처리 할 수 없습니다.');
      return;
    }

    setTabSetting(
      update(tabSetting, {
        [key]: {
          $set: {
            ...value,
            visible: !value.visible,
          },
        },
      })
    );
  };

  const onClickPinned = (key, value) => {
    let changedValue = {
      ...value,
      pinned: !value.pinned,
    };
    let originPinned = Object.keys(tabSetting).filter(
      (f) => tabSetting[f].pinned
    )[0];
    let originPinnedValue = { ...tabSetting[originPinned], pinned: false };
    setTabSetting(
      update(tabSetting, {
        [key]: { $set: changedValue },
        [originPinned]: { $set: originPinnedValue },
      })
    );
  };

  const onClickSave = async () => {
    chartStore.setTabSetting(tabSetting);
    chartStore.setOpenFormSetting(openFormSetting);
    await userApi.updateConfig(
      'customerChartTabSetting',
      JSON.stringify({
        tabSetting: tabSetting,
        openFormSetting: openFormSetting,
      })
    );
    dataEvent.emit(EventType.OPEN_FORM_SETTING_API);

    close();
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Object.keys(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return hooks.convertArrayToObject(
      result.map((v) => {
        return { key: v, value: tabSetting[v] };
      }),
      'key'
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const list = reorder(
      tabSetting,
      result.source.index,
      result.destination.index
    );
    setTabSetting(list);
  };

  return (
    <Layout title="통합차트 설정" width="374" close={() => close()}>
      <Body>
        <div>
          <TitleText>
            통합차트 열람 시 등록화면의 기본 값을 지정할 수 있습니다.
          </TitleText>
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid #dee2ec',
            borderRadius: '4px',
            padding: '10px',
            margin: '5px 0px',
          }}
        >
          <div>등록화면 기본 노출</div>
          <Switch
            checked={openFormSetting}
            onChange={() => {
              setOpenFormSetting(!openFormSetting);
            }}
          />
        </Box>
        <Hr />
        <div>
          <TitleText>
            <p>탭 순서와 보고싶은 탭만 지정할 수 있습니다.</p>
          </TitleText>
          <TitleText>
            <PinnedIcon />
            <p>핀 고정시 해당 메뉴가 기본으로 노출됩니다.</p>
          </TitleText>
          <TitleButtons>
            <ButtonWrapper>
              <span onClick={onClickAllSelect}>전체선택</span>
            </ButtonWrapper>
            <ButtonWrapper>
              <Reset />
              <span onClick={onClickReset}>초기화</span>
            </ButtonWrapper>
          </TitleButtons>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {Object.keys(tabSetting).map((tab, index) => (
                  <Draggable key={tab} draggableId={tab} index={index}>
                    {(provided) => (
                      <ItemBox
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Item key={tab}>
                          <div>
                            <CheckboxButton
                              control={
                                <CheckboxIcon
                                  checked={tabSetting[tab].visible}
                                  onChange={() =>
                                    onChangeChecked(tab, tabSetting[tab])
                                  }
                                  color="primary"
                                />
                              }
                              label={TabType.getName(tab)}
                            />
                            <HoverPinnedIcon
                              $pinned={tabSetting[tab].pinned}
                              $show={tabSetting[tab].visible}
                              onClick={() =>
                                onClickPinned(tab, tabSetting[tab])
                              }
                            />
                          </div>
                          <HoverVerticalDragArrow />
                        </Item>
                      </ItemBox>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Body>
      <FooterButton>
        <Button styled="outline" type="mix" onClick={() => close()}>
          취소
        </Button>
        <Button onClick={onClickSave}>확인</Button>
      </FooterButton>
    </Layout>
  );
};

TabSettingModal.propTypes = {
  close: PropTypes.func,
};

export default observer(TabSettingModal);
