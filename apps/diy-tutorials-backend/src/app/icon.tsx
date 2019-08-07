import React from 'react';

export const Icon = (props) => {
  const {iconClassName, content} = props;
  return <span className={`${iconClassName}`}>{content}</span>;
};
