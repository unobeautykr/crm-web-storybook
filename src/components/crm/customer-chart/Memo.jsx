import { useState, useEffect, forwardRef } from 'react';
import { useFetch } from 'use-http';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { buildUrl } from '~/utils/url';
import QuillTextField from '~/components/quill/QuillTextField';

const Wrapper = styled.div`
  width: 100%;
  min-width: 100%;
  max-width: fit-content;
`;

const Boilerplate = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
  p {
    flex: 0 0 auto;
    font-size: 11px;
  }
  button {
    height: 24px;
    max-width: 96px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 3px 10px 3px;
    font-size: 12px;
    margin-left: 8px;
    border: solid 1px #dee2ec;
    background-color: #fff;
    color: #484760;
  }
`;

const memoUrl = (tabName) =>
  buildUrl('boilerplate_memos', {
    limit: 5,
    orderBy: 'order asc',
    category: tabName,
  });

const Memo = forwardRef(({ tabName, value = '', onChange }, ref) => {
  const { data } = useFetch(memoUrl(tabName), []);
  const [memoBoilerplateList, setMemoBoilerplateList] = useState([]);

  useEffect(() => {
    if (data) setMemoBoilerplateList(data.data);
  }, [data]);

  return (
    <Wrapper ref={ref}>
      {memoBoilerplateList?.length > 0 && (
        <Boilerplate>
          <p>자주 쓰는 상용구</p>
          {memoBoilerplateList.slice(0, 5).map((v, i) => (
            <button
              key={i}
              onClick={() =>
                onChange((value === '<p><br></p>' ? '' : value) + v.contents)
              }
            >
              {v.title}
            </button>
          ))}
        </Boilerplate>
      )}
      <QuillTextField
        tabName={tabName}
        value={value}
        onChange={(v) => {
          onChange(v);
        }}
        setMemoBoilerplateList={setMemoBoilerplateList}
        placeholder="메모를 입력하세요."
        boilerplate
      />
    </Wrapper>
  );
});

Memo.propTypes = {
  tabName: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default Memo;
