import React from 'react';

import './content.scss';
import {RawHTML} from '../raw-html/raw-html';

/* tslint:disable:no-empty-interface */
export interface ContentProps {
  children?: any;
  innerHTML?: any;
}

export const Content = (props: ContentProps) => {
  if (props.innerHTML) {
    return <RawHTML html={props.innerHTML}/>;
  }

  return (
    <div>
      <p>Content</p>
      {props.children}
    </div>
  );
};
