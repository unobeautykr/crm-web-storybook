import { useState, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import { v4 as uuidv4 } from 'uuid';
import './quill.css';
import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useDialog } from '~/hooks/useDialog';
// import MemoBoilerplateModal from '~/components/modals/memo/MemoBoilerplateModal';
import { Box } from '@mui/material';
import { CustomToolbar } from './CustomToolbar';
import { ColorPopper } from './ColorPopper';

const StyledReactQuill = styled(ReactQuill)(
  ({ style }) => `
  width: 100%;
  .ql-snow {
    border-color: #dee2ec;
    ${style}
  }
  & .ql-container {
    font-size: 12px;
    height: auto;
  }
`
);

export default function QuillTextField({
  tabName,
  value,
  onChange,
  setMemoBoilerplateList,
  boilerplate,
  style,
  ...props
}) {
  const BoilerplateModal = useDialog();
  const quillRef = useRef(null);
  const colorRef = useRef(null);
  const backgroundRef = useRef(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [backgroundAnchorEl, setBackgroundAnchorEl] = useState(null);

  const colorPopper = useDialog();
  const backgroundPopper = useDialog();

  const addBoilerMemo = (newValue) => {
    onChange((value === '<p><br></p>' ? '' : value) + newValue.join(''));
  };

  const onUpdate = (update) => {
    addBoilerMemo(update);
  };

  const toolbarId = useMemo(() => `t-${uuidv4().substring(0, 8)}`, []);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: `#${toolbarId}`,
        handlers: {
          boilerplate: () => {
            BoilerplateModal.open();
          },
          color: () => {
            setColorAnchorEl(colorRef.current);
            colorPopper.toggle();
          },
          background: () => {
            setBackgroundAnchorEl(backgroundRef.current);
            backgroundPopper.toggle();
          },
        },
      },
    };
  }, []);

  const onChangeColor = (value) => {
    const editor = quillRef.current.getEditor();
    editor.format('color', value);
  };

  const onChangeBackground = (value) => {
    const editor = quillRef.current.getEditor();
    editor.format('background', value);
  };

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      {/* {BoilerplateModal.opened && (
        <MemoBoilerplateModal
          open={BoilerplateModal.opened}
          onClose={BoilerplateModal.close}
          tabName={tabName}
          onUpdate={onUpdate}
          updateMemoBoilerplateList={setMemoBoilerplateList}
        />
      )} */}
      <ColorPopper
        open={colorPopper.opened}
        onClose={colorPopper.close}
        onChange={onChangeColor}
        anchorEl={colorAnchorEl}
      />
      <ColorPopper
        open={backgroundPopper.opened}
        onClose={backgroundPopper.close}
        onChange={onChangeBackground}
        anchorEl={backgroundAnchorEl}
      />
      <CustomToolbar
        id={toolbarId}
        boilerplate={boilerplate}
        colorRef={colorRef}
        backgroundRef={backgroundRef}
      />
      <StyledReactQuill
        ref={quillRef}
        style={style}
        {...props}
        theme="snow"
        modules={modules}
        formats={[
          'background',
          'bold',
          'color',
          'italic',
          'strike',
          'underline',
        ]}
        value={value}
        onChange={onChange}
        preserveWhitespace
      />
    </Box>
  );
}

QuillTextField.propTypes = {
  tabName: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  setMemoBoilerplateList: PropTypes.func,
  boilerplate: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};
