import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { ContentsTooltip } from '~/components/ContentsTooltip';

const TitleContentsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  text-align: left;
  text-overflow: ellipsis;
  white-space: break-spaces;
`;

const TitleContentsOverflowWrapper = styled(TitleContentsWrapper)`
  max-height: 82px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Image = styled('img')`
  width: 64px;
  height: 64px;
  display: block;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: pointer;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const SmsTitleContent = ({ item }) => {
  return (
    <ContentsTooltip
      title={
        <div>
          {item.imageUrl && (
            <div>
              <Image
                style={{ height: '180px', width: 'auto' }}
                alt=""
                src={item.imageUrl}
              />
            </div>
          )}
          <TitleContentsWrapper>
            <div>{item.title}</div>
            <div>{item.contents}</div>
          </TitleContentsWrapper>
        </div>
      }
    >
      <Wrapper>
        <TitleContentsOverflowWrapper>
          <div>{item.title}</div>
          <div>{item.contents}</div>
        </TitleContentsOverflowWrapper>
        {item.imageUrl && (
          <div>
            <Image alt="" src={item.imageUrl} />
          </div>
        )}
      </Wrapper>
    </ContentsTooltip>
  );
};

SmsTitleContent.propTypes = {
  item: PropTypes.object,
};
