import React from 'react';

import './content.scss';
import {RawHTML} from '../raw-html/raw-html';

/* tslint:disable:no-empty-interface */
export interface ContentProps {
  className?: string;
  clientId?: string;
  children?: any;
  html?: any;
}

export const Content = (props: ContentProps) => {
  const {className, clientId, html, children} = props;
  const content = children ?
    <div>
      {children}
    </div>
    :
    <RawHTML html={html}/>;

  return (
    <div className={className}
         data-client_id={clientId}
    >
      {content}
    </div>
  );
};
