import PropTypes from 'prop-types';
import { Box } from '@mui/material';

export const CustomToolbar = ({ id, boilerplate, colorRef, backgroundRef }) => {
  return (
    <Box
      sx={{
        '&.ql-snow': {
          borderColor: '#dee2ec',
          borderBottom: 'none',
        },
      }}
      id={id}
    >
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button ref={colorRef} className="ql-color" />
      <button ref={backgroundRef} className="ql-background" />
      {boilerplate && <button className="ql-boilerplate" />}
    </Box>
  );
};

CustomToolbar.propTypes = {
  id: PropTypes.string,
  boilerplate: PropTypes.bool,
  colorRef: PropTypes.object,
  backgroundRef: PropTypes.object,
};
