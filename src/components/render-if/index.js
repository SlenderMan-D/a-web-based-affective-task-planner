// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

/**
 * rendering
 * @author hzzhaoxiangtao@corp.netease.com
 */
const RenderIf = ({ condition, empty, children }) => {
  if (condition) {
    return children;
  }
  return empty;
};

RenderIf.propTypes = {
  condition: PropTypes.bool,
  empty: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};
RenderIf.defaultProps = {
  condition: false,
  empty: null,
};

export default RenderIf;
